import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Início / Dashboard', icon: 'fa-solid fa-chart-pie', end: true },
  { to: '/chamada', label: 'Diário de Chamada', icon: 'fa-regular fa-calendar-check' },
  { to: '/aulas', label: 'Aulas Dadas & Histórico', icon: 'fa-regular fa-calendar-days' },
  { to: '/alunos', label: 'Alunos & Rendimento', icon: 'fa-solid fa-user-group' },
  { to: '/voluntarios', label: 'Voluntários', icon: 'fa-solid fa-user-tie' },
  { to: '/campeonatos', label: 'Campeonatos', icon: 'fa-solid fa-medal' },
  { to: '/configuracoes', label: 'Configurações', icon: 'fa-solid fa-gear' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="logo-area">
          <div className="logo-icon">
            <i className="fa-solid fa-shield" />
          </div>
          <div className="logo-text">
            <h2>VALENTES DE DAVI</h2>
            <p>Escola de Futebol Social</p>
          </div>
        </div>

        <ul className="menu-items">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}>
                <i className={l.icon} /> {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="user-profile-sidebar">
          <div className="user-avatar">VD</div>
          <div className="user-details">
            <h4>Coordenação Geral</h4>
            <p>admin@valentesdedavi.org</p>
          </div>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main-wrap">
        <div className="topbar">
          <button className="btn-icon" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <i className="fa-solid fa-bars" />
          </button>
          <strong>Valentes de Davi</strong>
        </div>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
