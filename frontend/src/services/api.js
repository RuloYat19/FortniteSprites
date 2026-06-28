import axios from 'axios';

// Usar URL relativa para producción (nginx proxy)
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const spritsService = {
  getAll: () => api.get('/sprits'),
  getById: (id) => api.get(`/sprits/${id}`),
  create: (data) => api.post('/sprits', data),
  update: (id, data) => api.put(`/sprits/${id}`, data),
  toggleColeccionado: (id) => api.patch(`/sprits/${id}/coleccionar`),
  toggleDominado: (id) => api.patch(`/sprits/${id}/dominar`),
  delete: (id) => api.delete(`/sprits/${id}`),
};

export default api;