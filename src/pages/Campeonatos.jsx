import { useEffect, useMemo, useState } from 'react'
import { assistidosApi } from '../api/services.js'
import { useToast } from '../components/Toast.jsx'
import { matricula } from '../utils.js'

const hojeISO = () => new Date().toISOString().slice(0, 10)
const CAMPOS = ['passe', 'chute', 'atitude']

// Tela do protótipo: lançamento de notas. O back-end ainda não tem avaliações/campeonatos,
// então a lista de alunos é real, mas as notas ficam só nesta tela (não são gravadas).
export default function Campeonatos() {
  const notify = useToast()
  const [alunos, setAlunos] = useState([])
  const [posicao, setPosicao] = useState('todas')
  const [data, setData] = useState(hojeISO())
  const [notas, setNotas] = useState({}) // { [id]: { passe, chute, atitude, obs } }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    assistidosApi
      .list({ apenas_ativos: true })
      .then(setAlunos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const posicoes = useMemo(() => [...new Set(alunos.map((a) => a.posicao_campo).filter(Boolean))].sort(), [alunos])
  const visiveis = alunos.filter((a) => posicao === 'todas' || a.posicao_campo === posicao)

  function setNota(id, campo, valor) {
    let v = valor
    if (CAMPOS.includes(campo) && v !== '') v = String(Math.min(10, Math.max(0, parseFloat(v) || 0)))
    setNotas((n) => ({ ...n, [id]: { ...n[id], [campo]: v } }))
  }

  function media(id) {
    const n = notas[id] || {}
    if (!CAMPOS.every((c) => n[c] !== undefined && n[c] !== '')) return null
    return CAMPOS.reduce((s, c) => s + parseFloat(n[c]), 0) / 3
  }

  return (
    <>
      <header className="header">
        <h1>Avaliações & Campeonatos</h1>
      </header>

      <div className="notice">
        <i className="fa-solid fa-circle-info" style={{ marginTop: 3 }} />
        <span>
          Protótipo: o back-end ainda não tem avaliações nem campeonatos. A lista de alunos é real, mas as notas
          não são gravadas.
        </span>
      </div>

      {error && <div className="error-box">{error}</div>}

      <section className="eval-controls">
        <div className="form-group">
          <label htmlFor="data_aval">Data da Avaliação</label>
          <input id="data_aval" type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="pos_aval">Posição / Categoria</label>
          <select id="pos_aval" value={posicao} onChange={(e) => setPosicao(e.target.value)}>
            <option value="todas">Todas</option>
            {posicoes.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </section>

      <section className="eval-container">
        <div className="eval-header">
          <div>
            <h3>Lançamento de Notas</h3>
            <span>Preencha as notas de 0 a 10. A média será calculada automaticamente.</span>
          </div>
        </div>

        {loading && <div className="empty">Carregando…</div>}
        {!loading && visiveis.length === 0 && <div className="empty">Nenhum aluno para avaliar.</div>}

        {visiveis.length > 0 && (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Matrícula</th><th>Atleta</th><th>Passe (0-10)</th><th>Chute (0-10)</th>
                  <th>Atitude (0-10)</th><th>Média Técnica</th><th>Obs. Breve</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((a) => {
                  const m = media(a.id)
                  return (
                    <tr key={a.id}>
                      <td>{matricula(a.id)}</td>
                      <td><strong>{a.nome_completo}</strong></td>
                      {CAMPOS.map((c) => (
                        <td key={c}>
                          <input
                            type="number" min="0" max="10" step="0.5" className="nota-input"
                            value={notas[a.id]?.[c] ?? ''}
                            onChange={(e) => setNota(a.id, c, e.target.value)}
                            aria-label={`${c} de ${a.nome_completo}`}
                          />
                        </td>
                      ))}
                      <td>
                        <span className={`media-display ${m === null ? '' : m >= 6 ? 'media-boa' : 'media-ruim'}`}>
                          {m === null ? '--' : m.toFixed(1)}
                        </span>
                      </td>
                      <td>
                        <input placeholder="Ex: Bom progresso" style={{ padding: 8, minWidth: 160 }} value={notas[a.id]?.obs ?? ''} onChange={(e) => setNota(a.id, 'obs', e.target.value)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="save-container">
          <button
            className="btn-save"
            onClick={() => notify(`Protótipo: avaliação de ${data.split('-').reverse().join('/')} ainda não é gravada (sem back-end).`, 'info')}
          >
            <i className="fa-solid fa-floppy-disk" /> Salvar Avaliações
          </button>
        </div>
      </section>
    </>
  )
}
