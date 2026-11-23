import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboardData } from '../data/useDashboardData.js'
import { computeRisk, daysToBirthday, whatsappLink } from '../utils.js'

// Notificações calculadas a partir dos dados reais:
//  - risco de abandono (2+ faltas consecutivas)
//  - aniversariantes dos próximos 7 dias
export default function Alertas() {
  const { loading, error, assistidos, aulas, chamadas } = useDashboardData()
  const [lidos, setLidos] = useState({})

  const itens = useMemo(() => {
    const risco = computeRisk(assistidos, aulas, chamadas, 2).map(({ aluno, faltas }) => ({
      key: `risco-${aluno.id}`,
      tipo: 'critical',
      titulo: 'Risco de Abandono Escolar',
      quando: faltas >= 3 ? 'Urgente' : 'Atenção',
      texto: (
        <>
          <strong>{aluno.nome_completo}{aluno.posicao_campo ? ` (${aluno.posicao_campo})` : ''}</strong> atingiu {faltas} faltas consecutivas.
        </>
      ),
      aluno,
    }))

    const aniversarios = assistidos
      .map((a) => ({ a, ...daysToBirthday(a.data_nascimento) }))
      .filter((x) => x.dias <= 7)
      .sort((x, y) => x.dias - y.dias)
      .map(({ a, dias, completa }) => ({
        key: `aniv-${a.id}`,
        tipo: 'info',
        titulo: 'Aniversariante da Semana',
        quando: dias === 0 ? 'Hoje' : dias === 1 ? 'Amanhã' : `Em ${dias} dias`,
        texto: (
          <>
            <strong>{a.nome_completo}</strong> completa {completa} anos {dias === 0 ? 'hoje' : dias === 1 ? 'amanhã' : `em ${dias} dias`}.
          </>
        ),
      }))

    return [...risco, ...aniversarios]
  }, [assistidos, aulas, chamadas])

  return (
    <>
      <header className="header">
        <h1>
          <i className="fa-solid fa-bell" style={{ color: 'var(--amarelo)' }} /> Central de Notificações
        </h1>
        <Link to="/" className="btn-cancel">
          <i className="fa-solid fa-arrow-left" /> Voltar
        </Link>
      </header>

      {error && <div className="error-box">{error}</div>}
      {loading && <div className="empty">Carregando…</div>}
      {!loading && !error && itens.length === 0 && (
        <div className="empty">
          <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: 'var(--verde)', marginBottom: 10 }} />
          <p>Tudo em dia! Nenhuma notificação no momento.</p>
        </div>
      )}

      <section className="alert-list">
        {itens.map((n) => (
          <div key={n.key} className={`alert-card alert-${n.tipo} ${lidos[n.key] ? 'read' : ''}`}>
            <div className="student-info">
              <div className={`icon-box icon-${n.tipo}`}>
                <i className={`fa-solid ${n.tipo === 'critical' ? 'fa-triangle-exclamation' : 'fa-cake-candles'}`} />
              </div>
              <div className="student-details">
                <h5>{n.titulo} <span className="date-badge">{n.quando}</span></h5>
                <p>{n.texto}</p>
              </div>
            </div>
            {n.aluno ? (
              <button className="btn-action btn-whatsapp" onClick={() => window.open(whatsappLink(n.aluno.telefone_responsavel), '_blank')}>
                <i className="fa-brands fa-whatsapp" /> Contatar Responsável
              </button>
            ) : (
              <button className="btn-action btn-muted" onClick={() => setLidos({ ...lidos, [n.key]: true })} disabled={lidos[n.key]}>
                <i className="fa-solid fa-check" /> {lidos[n.key] ? 'Lido' : 'Marcar como lido'}
              </button>
            )}
          </div>
        ))}
      </section>
    </>
  )
}
