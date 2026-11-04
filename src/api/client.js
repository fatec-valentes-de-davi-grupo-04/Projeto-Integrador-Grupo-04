// Cliente HTTP central: toda chamada à API passa por aqui.
export const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

// O FastAPI devolve erros em "detail": texto (400/404) ou lista (422).
function extractMessage(data, status) {
  const detail = data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${(d.loc || []).filter((l) => l !== 'body').join('.')}: ${d.msg}`)
      .join(' | ')
  }
  return `Erro ${status} ao falar com o servidor.`
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const qs = params
    ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : ''

  let res
  try {
    res = await fetch(`${BASE_URL}${path}${qs}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o back-end está rodando.',
      0,
    )
  }

  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(extractMessage(data, res.status), res.status)
  return data
}
