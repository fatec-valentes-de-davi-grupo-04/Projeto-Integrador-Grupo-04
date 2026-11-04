import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chamada from './pages/Chamada.jsx'
import Aulas from './pages/Aulas.jsx'
import Alunos from './pages/Alunos.jsx'
import AlunoForm from './pages/AlunoForm.jsx'
import Voluntarios from './pages/Voluntarios.jsx'
import Campeonatos from './pages/Campeonatos.jsx'
import Configuracoes from './pages/Configuracoes.jsx'
import Alertas from './pages/Alertas.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="chamada" element={<Chamada />} />
        <Route path="aulas" element={<Aulas />} />
        <Route path="alunos" element={<Alunos />} />
        <Route path="alunos/novo" element={<AlunoForm />} />
        <Route path="alunos/:id/editar" element={<AlunoForm />} />
        <Route path="voluntarios" element={<Voluntarios />} />
        <Route path="campeonatos" element={<Campeonatos />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
