import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { aulasApi, voluntariosApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { fmtHora } from '../utils.js'

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const VAZIO = { id: null, data: '', hora: '', titulo: '', local: '', voluntario_id: '', descricao: '' }

export default function Aulas() {
  const notify = useToast()
  const [aulas, setAulas] = useState([])
  const [voluntarios, setVoluntarios] = useState([])
  const [form, setForm] = useState(VAZIO)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [a, v] = await Promise.all([aulasApi.list(), voluntariosApi.list({ apenas_ativos: true })])
      setAulas(a)
      setVoluntarios(v)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Próximas primeiro (mais perto no topo); depois as concluídas (mais recentes primeiro)
  const ordenadas = useMemo(() => {
    const agora = new Date()
    const futuras = aulas.filter((a) => new Date(a.data_hora) >= agora).sort((x, y) => x.data_hora.localeCompare(y.data_hora))
    const passadas = aulas.filter((a) => new Date(a.data_hora) < agora).sort((x, y) => y.data_hora.localeCompare(x.data_hora))
    return [...futuras.map((a) => ({ a, futura: true })), ...passadas.map((a) => ({ a, futura: false }))]
  }, [aulas])

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  function editar(a) {
    setForm({
      id: a.id,
      data: a.data_hora.slice(0, 10),
      hora: a.data_hora.slice(11, 16),
      titulo: a.titulo,
      local: a.local,
      voluntario_id: String(a.voluntario_id),
      descricao: a.descricao || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        titulo: form.titulo.trim(),
        data_hora: `${form.data}T${form.hora}:00`,
        local: form.local.trim(),
        voluntario_id: Number(form.voluntario_id),
        descricao: form.descricao.trim() || null,
      }
      if (form.id) await aulasApi.update(form.id, payload)
      else await aulasApi.create(payload)
      notify(form.id ? 'Aula atualizada.' : 'Aula agendada com sucesso.')
      setForm(VAZIO)
      load()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function cancelar(a) {
    if (!window.confirm(`Cancelar a aula "${a.titulo}"?`)) return
    try {
      await aulasApi.remove(a.id)
      notify('Aula cancelada.')
      if (form.id === a.id) setForm(VAZIO)
      load()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <>
      <header className="header">
        <h1>Aulas Dadas & Histórico</h1>
      </header>

      {error && <div className="error-box">{error}</div>}

      <section className="schedule-grid">
        <div className="panel-form">
          <h3>{form.id ? 'Editar Treino' : 'Agendar Novo Treino'}</h3>
          <form onSubmit={submit}>
            <div className="form-group">
              <label htmlFor="data_treino">Data da Aula</label>
              <input id="data_treino" type="date" required value={form.data} onChange={set('data')} />
            </div>
            <div className="form-group">
              <label htmlFor="hora_treino">Horário Início</label>
              <input id="hora_treino" type="time" required value={form.hora} onChange={set('hora')} />
            </div>
            <div className="form-group">
              <label htmlFor="titulo_treino">Turma / Título</label>
              <input id="titulo_treino" required minLength={3} maxLength={100} placeholder="Ex: Treino Sub-13" value={form.titulo} onChange={set('titulo')} />
            </div>
            <div className="form-group">
              <label htmlFor="local_treino">Local</label>
              <input id="local_treino" required minLength={2} maxLength={150} placeholder="Ex: Campo 1" value={form.local} onChange={set('local')} />
            </div>
            <div className="form-group">
              <label htmlFor="treinador">Treinador Responsável</label>
              <select id="treinador" required value={form.voluntario_id} onChange={set('voluntario_id')}>
                <option value="">{voluntarios.length ? 'Selecione...' : 'Cadastre um voluntário primeiro'}</option>
                {voluntarios.map((v) => (
                  <option key={v.id} value={v.id}>{v.nome_completo} — {v.funcao}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tema_treino">Tema do Treino</label>
              <input id="tema_treino" placeholder="Ex: Fundamentos Básicos" value={form.descricao} onChange={set('descricao')} />
            </div>
            <button type="submit" className="btn-save" style={{ width: '100%' }} disabled={saving}>
              <i className="fa-solid fa-calendar-plus" /> {saving ? 'Salvando…' : form.id ? 'Salvar Alterações' : 'Agendar Aula'}
            </button>
            {form.id && (
              <button type="button" className="btn-cancel" style={{ width: '100%', marginTop: 10, justifyContent: 'center' }} onClick={() => setForm(VAZIO)}>
                Cancelar edição
              </button>
            )}
          </form>
        </div>

        <div className="panel-agenda">
          <h3>Cronograma Oficial</h3>
          {loading && <div className="empty">Carregando…</div>}
          {!loading && ordenadas.length === 0 && <div className="empty">Nenhuma aula agendada ainda.</div>}
          <div className="agenda-list">
            {ordenadas.map(({ a, futura }) => {
              const d = new Date(a.data_hora)
              return (
                <article key={a.id} className={`agenda-card ${futura ? 'future' : 'past'}`}>
                  <div className="agenda-info">
                    <div className="agenda-date">
                      <span className="day">{String(d.getDate()).padStart(2, '0')}</span>
                      <span className="month">{MESES[d.getMonth()]}</span>
                    </div>
                    <div className="agenda-details">
                      <h4>
                        {a.titulo}
                        <span className={`badge ${futura ? 'badge-future' : 'badge-past'}`}>{futura ? 'Próximo' : 'Concluído'}</span>
                      </h4>
                      <p><i className="fa-regular fa-clock" /> {fmtHora(a.data_hora)} • {a.local}</p>
                      <p><i className="fa-solid fa-user-tie" /> <strong>Treinador:</strong> {a.voluntario?.nome_completo || '—'}</p>
                      {a.descricao && <p><i className="fa-solid fa-futbol" /> <strong>Tema:</strong> {a.descricao}</p>}
                    </div>
                  </div>
                  <div className="agenda-actions">
                    <button className="btn-icon" title="Editar" onClick={() => editar(a)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    {futura ? (
                      <button className="btn-icon delete" title="Cancelar aula" onClick={() => cancelar(a)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    ) : (
                      <Link to={`/chamada?aula=${a.id}`} className="btn-icon" title="Ver diário de chamada">
                        <i className="fa-solid fa-clipboard-list" />
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
