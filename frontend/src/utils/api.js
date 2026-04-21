import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export const methodsApi = {
  list: (params) => api.get('/methods/', { params }),
  get: (slug) => api.get(`/methods/${slug}`),
  create: (data) => api.post('/methods/', data),
  update: (slug, data) => api.put(`/methods/${slug}`, data),
  delete: (slug) => api.delete(`/methods/${slug}`),
}

export const architecturesApi = {
  list: (params) => api.get('/architectures/', { params }),
  get: (slug) => api.get(`/architectures/${slug}`),
  compare: (ids) => api.get('/architectures/compare', { params: { ids: ids.join(',') } }),
  create: (data) => api.post('/architectures/', data),
  update: (slug, data) => api.put(`/architectures/${slug}`, data),
  delete: (slug) => api.delete(`/architectures/${slug}`),
}

export const toolsApi = {
  list: (params) => api.get('/tools/', { params }),
  get: (slug) => api.get(`/tools/${slug}`),
  create: (data) => api.post('/tools/', data),
  update: (slug, data) => api.put(`/tools/${slug}`, data),
  delete: (slug) => api.delete(`/tools/${slug}`),
}

export const evaluationsApi = {
  list: (params) => api.get('/evaluations/', { params }),
  create: (data) => api.post('/evaluations/', data),
  delete: (id) => api.delete(`/evaluations/${id}`),
}

export const statsApi = {
  get: () => api.get('/stats'),
}

export default api

// ── Convenience fetch helpers (used by ExportPage, ToolComparePage) ──────────
export const fetchMethods = () => methodsApi.list().then(r => r.data)
export const fetchArchitectures = () => architecturesApi.list().then(r => r.data)
export const fetchTools = () => toolsApi.list().then(r => r.data)
export const fetchEvaluations = () => evaluationsApi.list().then(r => r.data)
