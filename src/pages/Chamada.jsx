import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { aulasApi, assistidosApi, chamadasApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { encodePresenca, fmtData, fmtHora, idade, matricula, obsText, statusOf } from '../utils.js'

const hojeISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function Chamada() {
  const notify = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const aulaParam = params.get('aula')

  const [aulas, setAulas] = useState([])
  const [alunos, setAlunos] = useState([])
  const [data, setData] = useState(hojeISO())
  const [aulaId, setAulaId] = useState('')
  const [rows, setRows] = useState({}) // { [assistido_id]: { status, obs } }
  const [loading, setLoading] = useState(true)
  const [loadingChamada, setLoadingChamada] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [a, s] = await Promise.all([aulasApi.list(), assistidosApi.list({ apenas_ativos: true })])
      setAulas(a)
      setAlunos(s)
      return a
    } catch (e) {
      setError(e.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  // Primeira carga; se veio de "Aulas" com ?aula=ID, já abre aquela aula
  useEffect(() => {
    carregar().then((a) => {
      const alvo = aulaParam && a.find((x) => String(x.id) === aulaParam)
      if (alvo) {
        setData(alvo.data_hora.slice(0, 10))
        setAulaId(String(alvo.id))
      }
    })
  }, [carregar, aulaParam])

  const aulasDoDia = useMemo(
    () => aulas.filter((a) => a.data_hora.slice(0, 10) === data).sort((x, y) => x.data_hora.localeCompare(y.data_hora)),
    [aulas, data],
  )
  const aula = aulas.find((a) => String(a.id) === aulaId)

  // Ao escolher a aula, carrega a chamada que já foi gravada (se houver)
  useEffect(() => {
    if (!aulaId || alunos.length === 0) return
    setLoadingChamada(true)
    chamadasApi
      .byAula(aulaId)
      .then((registros) => {
        const map = {}
        alunos.forEach((a) => (map[a.id] = { status: 'presente', obs: '' }))
        registros.forEach((r) => (map[r.assistido_id] = { status: statusOf(r), obs: obsText(r) }))
        setRows(map)
      })
      .catch((e) => notify(e.message, 'error'))
      .finally(() => setLoadingChamada(false))
  }, [aulaId, alunos, notify])

  const setRow = (id, patch) => setRows((r) => ({ ...r, [id]: { ...r[id], ...patch } }))
  const marcarTodos = () =>
    setRows((r) => Object.fromEntries(Object.entries(r).map(([id, v]) => [id, { ...v, status: 'presente' }])))

  async function gravar() {
    setSaving(true)
    try {
      const presencas = alunos.map((a) => ({
        assistido_id: a.id,
        ...encodePresenca(rows[a.id]?.status ?? 'presente', rows[a.id]?.obs),
      }))
      await chamadasApi.saveBatch(Number(aulaId), presencas)
      notify('Diário gravado com sucesso.')
      navigate('/')
    } catch (e) {
      notify(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <header className="header">
        <h1>Diário de Chamada</h1>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="call-controls">
        <div className="form-group">
          <label htmlFor="data_aula">Data do Treino</label>
          <input
            type="date"
            id="data_aula"
            value={data}
            onChange={(e) => {
              setData(e.target.value)
              setAulaId('')
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="aula_sel">Aula / Turma</label>
          <select id="aula_sel" value={aulaId} onChange={(e) => setAulaId(e.target.value)} disabled={loading}>
            <option value="">
              {loading ? 'Carregando…' : aulasDoDia.length ? 'Selecione a aula...' : 'Nenhuma aula nesta data'}
            </option>
            {aulasDoDia.map((a) => (
              <option key={a.id} value={a.id}>
                {fmtHora(a.data_hora)} — {a.titulo}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn-load" onClick={carregar} disabled={loading}>
          <i className="fa-solid fa-magnifying-glass" /> Buscar Aula
        </button>
      </section>

      {aula && (
        <section className="attendance-container">
          <div className="attendance-header">
            <div>
              <h3>{aula.titulo}</h3>
              <span>
                Data: {fmtData(aula.data_hora)} • Treinador: {aula.voluntario?.nome_completo || '—'} • Local: {aula.local}
              </span>
            </div>
            <button type="button" className="btn-check-all" onClick={marcarTodos}>
              <i className="fa-solid fa-check-double" /> Marcar Todos Presentes
            </button>
          </div>

          {alunos.length === 0 && <div className="empty">Nenhum aluno ativo cadastrado.</div>}
          {loadingChamada && <div className="empty">Carregando chamada…</div>}

          {alunos.length > 0 && !loadingChamada && (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Matrícula</th>
                    <th>Nome do Atleta</th>
                    <th>Idade</th>
                    <th>Presença</th>
                    <th>Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((a) => {
                    const r = rows[a.id] || { status: 'presente', obs: '' }
                    return (
                      <tr key={a.id}>
                        <td>{matricula(a.id)}</td>
                        <td><strong>{a.nome_completo}</strong></td>
                        <td>{idade(a.data_nascimento)} anos</td>
                        <td>
                          <div className="radio-row">
                            {[
                              ['presente', 'Presente', 'r-presente'],
                              ['falta', 'Falta', 'r-falta'],
                              ['justificada', 'Justificada', 'r-just'],
                            ].map(([valor, rotulo, cls]) => (
                              <label key={valor} className={cls}>
                                <input
                                  type="radio"
                                  name={`status_${a.id}`}
                                  value={valor}
                                  checked={r.status === valor}
                                  onChange={() => setRow(a.id, { status: valor })}
                                />
                                {rotulo}
                              </label>
                            ))}
                          </div>
                        </td>
                        <td>
                          <input
                            className="obs-input"
                            placeholder="Opcional"
                            maxLength={240}
                            value={r.obs}
                            onChange={(e) => setRow(a.id, { obs: e.target.value })}
                            aria-label={`Observação de ${a.nome_completo}`}
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {alunos.length > 0 && (
            <div className="save-container">
              <button type="button" className="btn-save" onClick={gravar} disabled={saving || loadingChamada}>
                <i className="fa-solid fa-floppy-disk" /> {saving ? 'Gravando…' : 'Gravar Diário'}
              </button>
            </div>
          )}
        </section>
      )}
    </>
  )
}
