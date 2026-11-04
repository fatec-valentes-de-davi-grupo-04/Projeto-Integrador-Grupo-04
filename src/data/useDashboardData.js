import { useEffect, useState } from 'react'
import { assistidosApi, aulasApi, chamadasApi } from '../api/services.js'

// Carrega tudo que o Painel e a Central de Notificações precisam:
// assistidos ativos, aulas e as chamadas de cada aula que já aconteceu.
export function useDashboardData() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    assistidos: [],
    aulas: [],
    chamadas: {},
  })

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [assistidos, aulas] = await Promise.all([
          assistidosApi.list({ apenas_ativos: true }),
          aulasApi.list(),
        ])
        const agora = new Date()
        const passadas = aulas.filter((a) => new Date(a.data_hora) <= agora)
        const pares = await Promise.all(
          passadas.map((a) =>
            chamadasApi
              .byAula(a.id)
              .then((r) => [a.id, r])
              .catch(() => [a.id, []]),
          ),
        )
        if (alive) {
          setState({ loading: false, error: '', assistidos, aulas, chamadas: Object.fromEntries(pares) })
        }
      } catch (e) {
        if (alive) setState((s) => ({ ...s, loading: false, error: e.message }))
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return state
}
