import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

// Envolve o Chart.js. "data" e "options" devem ser estáveis (useMemo) para não recriar o gráfico.
export default function ChartCanvas({ type, data, options }) {
  const ref = useRef(null)

  useEffect(() => {
    const chart = new Chart(ref.current, { type, data, options })
    return () => chart.destroy()
  }, [type, data, options])

  return <canvas ref={ref} />
}
