import { useCallback, useEffect, useMemo, useState } from 'react'
import { voluntariosApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { maskPhone } from '../utils.js'

const VAZIO = { id: null, nome_completo: '', email: '', telefone: '', funcao: '' }

// Não existe no protótipo, mas o back-end exige um voluntário (treinador) para cada aula.
export default function Voluntarios() {
  const notify = useToast()
  const [lista, setLista] = useState([])
  const [form, setForm] = useState(VAZIO)
  const [busca, setBusca] = useState('')
  const [inativos, setInativos] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setLista(await voluntariosApi.list({ apenas_ativos: !inativos }))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [inativos])

  useEffect(() => {
    load()
  }, [load])

  const filtrados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return t ? lista.filter((v) => `${v.nome_completo} ${v.email} ${v.funcao}`.toLowerCase().includes(t)) : lista
  }, [lista, busca])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        nome_completo: form.nome_completo.trim(),
        email: form.email.trim(),
        telefone: form.telefone.trim(),
        funcao: form.funcao.trim(),
      }
      if (form.id) await voluntariosApi.update(form.id, payload)
      else await voluntariosApi.create(payload)
      notify(form.id ? 'Voluntário atualizado.' : 'Voluntário cadastrado com sucesso.')
      setForm(VAZIO)
      load()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function inativar(v) {
    if (!window.confirm(`Desativar ${v.nome_completo}?`)) return
    try {
      await voluntariosApi.remove(v.id)
      notify('Voluntário desativado.')
      load()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function reativar(v) {
    try {
      await voluntariosApi.update(v.id, { ativo: true })
      notify('Voluntário reativado.')
      load()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <>
      <header className="header">
        <h1>Voluntários & Treinadores</h1>
      </header>

      <section className="schedule-grid">
        <div className="panel-form">
          <h3>{form.id ? 'Editar Voluntário' : 'Novo Voluntário'}</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="v_nome">Nome Completo</label>
              <input id="v_nome" required minLength={3} maxLength={150} value={form.nome_completo} onChange={set('nome_completo')} />
            </div>
            <div className="form-group">
              <label htmlFor="v_email">E-mail</label>
              <input id="v_email" type="email" required value={form.email} onChange={set('email')} />
            </div>
            <div className="form-group">
              <label htmlFor="v_tel">Telefone / WhatsApp</label>
              <input id="v_tel" type="tel" required minLength={8} maxLength={20} placeholder="(16) 90000-0000" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskPhone(e.target.value) })} />
            </div>
            <div className="form-group">
              <label htmlFor="v_funcao">Função</label>
              <input id="v_funcao" required minLength={2} maxLength={80} placeholder="Ex: Treinador Sub-15" value={form.funcao} onChange={set('funcao')} />
            </div>
            <button type="submit" className="btn-save" style={{ width: '100%' }} disabled={saving}>
              <i className="fa-solid fa-floppy-disk" /> {saving ? 'Salvando…' : form.id ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
            {form.id && (
              <button type="button" className="btn-cancel" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }} onClick={() => setForm(VAZIO)}>
                Cancelar edição
              </button>
            )}
          </form>
        </div>

        <div className="table-container">
          <div className="table-controls">
            <div className="search-box">
              <i className="fa-solid fa-magnifying-glass" style={{ color: '#94A3B8' }} />
              <input type="text" placeholder="Buscar voluntário..." value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Buscar voluntário" />
            </div>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={inativos} onChange={(e) => setInativos(e.target.checked)} />
              Mostrar inativos
            </label>
          </div>

          {error && <div className="error-box">{error} <button className="link-btn" onClick={load}>Tentar de novo</button></div>}
          {loading && <div className="empty">Carregando…</div>}
          {!loading && !error && filtrados.length === 0 && <div className="empty">Nenhum voluntário encontrado.</div>}

          {filtrados.length > 0 && (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr><th>Nome</th><th>Função</th><th>Contato</th><th>Status</th><th>Ações</th></tr>
                </thead>
                <tbody>
                  {filtrados.map((v) => (
                    <tr key={v.id} className={v.ativo ? '' : 'inativo'}>
                      <td><strong>{v.nome_completo}</strong><br /><small>{v.email}</small></td>
                      <td>{v.funcao}</td>
                      <td>{v.telefone}</td>
                      <td><span className={`status-badge ${v.ativo ? 'status-ativo' : 'status-inativo'}`}>{v.ativo ? 'Ativo' : 'Inativo'}</span></td>
                      <td className="actions">
                        <button className="btn-icon-action btn-edit" title="Editar" onClick={() => { setForm({ id: v.id, nome_completo: v.nome_completo, email: v.email, telefone: v.telefone, funcao: v.funcao }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                          <i className="fa-solid fa-pen-to-square" />
                        </button>
                        {v.ativo ? (
                          <button className="btn-icon-action btn-delete" title="Desativar" onClick={() => inativar(v)}><i className="fa-solid fa-trash" /></button>
                        ) : (
                          <button className="btn-icon-action btn-restore" title="Reativar" onClick={() => reativar(v)}><i className="fa-solid fa-rotate-left" /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
