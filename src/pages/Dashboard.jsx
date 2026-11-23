import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ChartCanvas from '../components/ChartCanvas.jsx'
import { useDashboardData } from '../data/useDashboardData.js'
import { computeRisk, initials, statusOf, whatsappLink } from '../utils.js'

const META_ANUAL = 100
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// Últimos 6 meses: total acumulado de alunos cadastrados até o fim de cada mês
function crescimento(assistidos) {
  const hoje = new Date()
  const labels = []
  const valores = []
  for (let i = 5; i >= 0; i--) {
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1)
    labels.push(MESES[(fim.getMonth() + 11) % 12])
    valores.push(assistidos.filter((a) => new Date(a.criado_em) < fim).length)
  }
  return { labels, valores }
}

export default function Dashboard() {
  const { loading, error, assistidos, aulas, chamadas } = useDashboardData()

  const stats = useMemo(() => {
    const todos = Object.values(chamadas).flat()
    const contagem = { presente: 0, justificada: 0, falta: 0 }
    todos.forEach((r) => contagem[statusOf(r)]++)
    const total = todos.length
    return {
      ...contagem,
      total,
      aulasComDiario: Object.values(chamadas).filter((c) => c.length > 0).length,
      percPresenca: total ? Math.round(((contagem.presente + contagem.justificada) / total) * 100) : null,
      risco: computeRisk(assistidos, aulas, chamadas, 2),
      cresc: crescimento(assistidos),
    }
  }, [assistidos, aulas, chamadas])

  const donutData = useMemo(
    () => ({
      labels: ['Presentes', 'Justificadas', 'Faltas'],
      datasets: [
        {
          data: [stats.presente, stats.justificada, stats.falta],
          backgroundColor: ['#3B82F6', '#EBB624', '#EF4444'],
          borderWidth: 0,
          cutout: '65%',
        },
      ],
    }),
    [stats],
  )
  const donutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } },
      },
    }),
    [],
  )

  const barData = useMemo(
    () => ({
      labels: stats.cresc.labels,
      datasets: [{ label: 'Alunos', data: stats.cresc.valores, backgroundColor: '#137752', borderRadius: 4, barPercentage: 0.6 }],
    }),
    [stats],
  )
  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, suggestedMax: 5, grid: { color: 'rgba(148,163,184,0.2)' }, ticks: { precision: 0, color: '#64748B', font: { size: 10 } } },
        x: { grid: { display: false }, ticks: { color: '#64748B', font: { size: 11 } } },
      },
    }),
    [],
  )

  const totalAlunos = assistidos.length
  const ministradas = stats.aulasComDiario
  const pct = Math.round((totalAlunos / META_ANUAL) * 100)

  return (
    <>
      <header className="header">
        <h1>Painel Geral - Valentes de Davi</h1>
        <div className="header-actions">
          <Link to="/configuracoes" className="btn-icon" title="Modo escuro (ir para configurações)">
            <i className="fa-regular fa-moon" />
          </Link>
          <Link to="/alunos/novo" className="btn-primary">
            <i className="fa-solid fa-user-plus" /> Cadastrar Novo Aluno
          </Link>
        </div>
      </header>

      {error && <div className="error-box">{error}</div>}

      <p className="section-title">Acessos Rápidos da Coordenação</p>
      <section className="quick-access-grid">
        <Link to="/chamada" className="qa-card highlight">
          <div className="qa-info">
            <p>Dia de Treino</p>
            <h3>Abrir Diário de Chamada</h3>
          </div>
          <div className="qa-icon"><i className="fa-regular fa-calendar-check" /></div>
        </Link>
        <Link to="/campeonatos" className="qa-card">
          <div className="qa-info">
            <p>Competição & Torneio</p>
            <h3>Criar Campeonato</h3>
          </div>
          <div className="qa-icon"><i className="fa-solid fa-medal" /></div>
        </Link>
        <Link to="/configuracoes" className="qa-card">
          <div className="qa-info">
            <p>Gestão do Sistema</p>
            <h3>Configurações Gerais</h3>
          </div>
          <div className="qa-icon yellow"><i className="fa-solid fa-gear" /></div>
        </Link>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <h4>Alunos Inscritos</h4>
          <div className="number">{loading ? '…' : totalAlunos}</div>
          <p>Matrículas ativas na ONG</p>
        </div>
        <div className="kpi-card">
          <h4>Aulas Ministradas</h4>
          <div className="number">{loading ? '…' : ministradas}</div>
          <p>Diários de presença subidos</p>
        </div>
        <div className="kpi-card green-text">
          <h4>Presença Geral</h4>
          <div className="number">{loading ? '…' : stats.percPresenca === null ? '—' : `${stats.percPresenca}%`}</div>
          <p>Presenças + Justificadas</p>
        </div>
        <div className="kpi-card yellow-text">
          <h4>Campeonatos Marcados</h4>
          <div className="number">—</div>
          <p>Módulo ainda sem back-end</p>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Distribuição Geral de Frequência</h3>
            <p>Total acumulado de todas as chamadas lançadas</p>
          </div>
          <div className="chart-container">
            {stats.total > 0 ? (
              <ChartCanvas type="doughnut" data={donutData} options={donutOptions} />
            ) : (
              <div className="empty">{loading ? 'Carregando…' : 'Nenhuma chamada lançada ainda.'}</div>
            )}
          </div>
          <div className="custom-legend">
            <div className="legend-item"><span className="num blue">{stats.presente}</span><span className="label">Presentes</span></div>
            <div className="legend-item"><span className="num yellow">{stats.justificada}</span><span className="label">Justificadas</span></div>
            <div className="legend-item"><span className="num red">{stats.falta}</span><span className="label">Faltas</span></div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Crescimento de Alunos / Ingressantes</h3>
            <p>Evolução do número de assistidos acolhidos no projeto</p>
          </div>
          <div className="chart-container">
            <ChartCanvas type="bar" data={barData} options={barOptions} />
          </div>
          <div className="chart-footer">
            <span>Meta Anual do Projeto: <strong>{META_ANUAL} alunos</strong></span>
            <span><strong>{pct}% atingido ({totalAlunos}/{META_ANUAL})</strong></span>
          </div>
        </div>
      </section>

      <section className={`alert-section ${stats.risco.length === 0 ? 'ok' : ''}`}>
        <div className="alert-header">
          <h4>
            <i className={`fa-solid ${stats.risco.length ? 'fa-triangle-exclamation' : 'fa-circle-check'}`} />
            {stats.risco.length
              ? 'Risco de Abandono Escolar / Social (2 ou mais faltas consecutivas)'
              : 'Nenhum aluno em risco de abandono'}
          </h4>
          <Link to="/alertas">Ver todas as notificações</Link>
        </div>
        {stats.risco.slice(0, 3).map(({ aluno, faltas }) => (
          <div className="alert-body" key={aluno.id}>
            <div className="student-info">
              <div className="student-pic">{initials(aluno.nome_completo)}</div>
              <div className="student-details">
                <h5>{aluno.nome_completo} {aluno.posicao_campo && <span>({aluno.posicao_campo})</span>}</h5>
                <p>{faltas} faltas consecutivas • <span>Responsável: {aluno.nome_responsavel}</span></p>
              </div>
            </div>
            <button className="btn-whatsapp" onClick={() => window.open(whatsappLink(aluno.telefone_responsavel), '_blank')}>
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </button>
          </div>
        ))}
      </section>
    </>
  )
}
