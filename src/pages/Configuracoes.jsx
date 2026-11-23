import { useState } from 'react'
import { useToast } from '../components/Toast.jsx'
import { applyTheme, getStoredTheme } from '../utils.js'

export default function Configuracoes() {
  const notify = useToast()
  const [dark, setDark] = useState(getStoredTheme())
  const [alertas, setAlertas] = useState(true)

  function toggleDark(e) {
    setDark(e.target.checked)
    applyTheme(e.target.checked)
  }

  return (
    <>
      <header className="header">
        <h1>Configurações Gerais</h1>
      </header>

      <section className="settings-grid">
        <div className="panel">
          <h3>Minha Conta</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="c_nome">Nome de Exibição</label>
              <input id="c_nome" defaultValue="Coordenação Geral" />
            </div>
            <div className="form-group">
              <label htmlFor="c_email">E-mail de Login</label>
              <input id="c_email" type="email" defaultValue="admin@valentesdedavi.org" readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
            <div className="form-group">
              <label htmlFor="c_senha">Nova Senha</label>
              <input id="c_senha" type="password" placeholder="••••••••" />
            </div>
            <button
              type="button"
              className="btn-save"
              onClick={() => notify('Protótipo: o back-end ainda não tem login nem contas de usuário.', 'info')}
            >
              <i className="fa-solid fa-floppy-disk" /> Atualizar Dados
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Aparência e Preferências</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Modo Escuro (Dark Mode)</h4>
              <p>Ative para reduzir o cansaço visual em ambientes noturnos.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={dark} onChange={toggleDark} aria-label="Modo escuro" />
              <span className="slider" />
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Notificações de Faltas</h4>
              <p>Receber alertas quando um aluno faltar 3 vezes seguidas.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={alertas} onChange={(e) => setAlertas(e.target.checked)} aria-label="Notificações de faltas" />
              <span className="slider" />
            </label>
          </div>
        </div>
      </section>
    </>
  )
}
