import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { assistidosApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { idade, matricula } from '../utils.js'

export default function Alunos() {
  const notify = useToast()
  const [alunos, setAlunos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busca, setBusca] = useState('')
  const [posicao, setPosicao] = useState('todas')
  const [status, setStatus] = useState('ativos')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // traz ativos e inativos; o filtro de status é feito aqui na tela
      setAlunos(await assistidosApi.list({ apenas_ativos: false }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const posicoes = useMemo(
    () => [...new Set(alunos.map((a) => a.posicao_campo).filter(Boolean))].sort(),
    [alunos],
  )

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return alunos.filter((a) => {
      if (status === 'ativos' && !a.ativo) return false
      if (status === 'inativos' && a.ativo) return false
      if (posicao !== 'todas' && a.posicao_campo !== posicao) return false
      if (!t) return true
      return `${a.nome_completo} ${matricula(a.id)} ${a.nome_responsavel} ${a.cpf || ''}`.toLowerCase().includes(t)
    })
  }, [alunos, busca, posicao, status])

  async function inativar(a) {
    if (!window.confirm(`Inativar ${a.nome_completo}? Você poderá reativar depois.`)) return
    try {
      await assistidosApi.remove(a.id)
      notify('Aluno inativado.')
      load()
    } catch (e) {
      notify(e.message, 'error')
    }
  }

  async function reativar(a) {
    try {
      await assistidosApi.update(a.id, { ativo: true })
      notify('Aluno reativado.')
      load()
    } catch (e) {
      notify(e.message, 'error')
    }
  }

  return (
    <>
      <header className="header">
        <h1>Alunos & Rendimento</h1>
        <div className="header-actions">
          <Link to="/alunos/novo" className="btn-primary">
            <i className="fa-solid fa-user-plus" /> Cadastrar Novo Aluno
          </Link>
        </div>
      </header>

      <section className="table-container">
        <div className="table-controls">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass" style={{ color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Buscar aluno por nome, matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar aluno"
            />
          </div>
          <div className="filters">
            <select value={posicao} onChange={(e) => setPosicao(e.target.value)} aria-label="Filtrar por posição">
              <option value="todas">Todas as Posições</option>
              {posicoes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtrar por status">
              <option value="todos">Todos os Status</option>
              <option value="ativos">Apenas Ativos</option>
              <option value="inativos">Apenas Inativos</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="error-box">
            {error} <button className="link-btn" onClick={load}>Tentar de novo</button>
          </div>
        )}
        {loading && <div className="empty">Carregando…</div>}
        {!loading && !error && filtrados.length === 0 && <div className="empty">Nenhum aluno encontrado.</div>}

        {filtrados.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th>
                  <th>Nome do Aluno</th>
                  <th>Posição</th>
                  <th>Responsável</th>
                  <th>Contato</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((a) => (
                  <tr key={a.id} className={a.ativo ? '' : 'inativo'}>
                    <td>{matricula(a.id)}</td>
                    <td>
                      <strong>{a.nome_completo}</strong>
                      <br />
                      <small>{idade(a.data_nascimento)} anos</small>
                    </td>
                    <td>{a.posicao_campo || '—'}</td>
                    <td>{a.nome_responsavel}</td>
                    <td>{a.telefone_responsavel}</td>
                    <td>
                      <span className={`status-badge ${a.ativo ? 'status-ativo' : 'status-inativo'}`}>
                        {a.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="actions">
                      <Link to={`/alunos/${a.id}/editar`} className="btn-icon-action btn-edit" title="Editar perfil">
                        <i className="fa-solid fa-pen-to-square" />
                      </Link>
                      {a.ativo ? (
                        <button className="btn-icon-action btn-delete" title="Inativar" onClick={() => inativar(a)}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      ) : (
                        <button className="btn-icon-action btn-restore" title="Reativar" onClick={() => reativar(a)}>
                          <i className="fa-solid fa-rotate-left" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}
