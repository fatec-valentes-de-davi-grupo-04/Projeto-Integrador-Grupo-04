import { request } from './client.js'

// Todas as listas terminam com "/" para evitar o redirect 307 do FastAPI.

export const voluntariosApi = {
  list: (params = {}) => request('/voluntarios/', { params: { limit: 500, ...params } }),
  create: (data) => request('/voluntarios/', { method: 'POST', body: data }),
  update: (id, data) => request(`/voluntarios/${id}`, { method: 'PATCH', body: data }),
  remove: (id) => request(`/voluntarios/${id}`, { method: 'DELETE' }),
}

// ATENÇÃO: no back-end a rota de assistidos está escrita "/{assitido_id}" (sem o 's'),
// então o FastAPI exige também "?assistido_id=" na query. Mandamos os dois: quando o
// back for corrigido, o parâmetro extra é simplesmente ignorado e tudo continua funcionando.
const q = (id) => ({ assistido_id: id })

export const assistidosApi = {
  list: (params = {}) => request('/assistido/', { params: { limit: 500, ...params } }),
  get: (id) => request(`/assistido/${id}`, { params: q(id) }),
  create: (data) => request('/assistido/', { method: 'POST', body: data }),
  update: (id, data) => request(`/assistido/${id}`, { method: 'PATCH', body: data, params: q(id) }),
  remove: (id) => request(`/assistido/${id}`, { method: 'DELETE', params: q(id) }),
}

export const aulasApi = {
  list: (params = {}) => request('/aulas/', { params: { limit: 500, ...params } }),
  create: (data) => request('/aulas/', { method: 'POST', body: data }),
  update: (id, data) => request(`/aulas/${id}`, { method: 'PATCH', body: data }),
  remove: (id) => request(`/aulas/${id}`, { method: 'DELETE' }),
}

export const chamadasApi = {
  byAula: (aulaId) => request(`/chamadas/aula/${aulaId}`),
  saveBatch: (aula_id, presencas) =>
    request('/chamadas/lote', { method: 'POST', body: { aula_id, presencas } }),
  update: (id, data) => request(`/chamadas/${id}`, { method: 'PATCH', body: data }),
}
