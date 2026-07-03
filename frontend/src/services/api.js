import axios from 'axios';

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
  toggleInventario: (id) => api.patch(`/sprits/${id}/inventario`),
  delete: (id) => api.delete(`/sprits/${id}`),
};

export const cantidadPolvoService = {
  getAll: () => axios.get(`${API_URL}/cantidad-polvo`),
  getById: (id) => axios.get(`${API_URL}/cantidad-polvo/${id}`),
  getByCombinacion: (rareza, nivelEspiritu) => 
    axios.get(`${API_URL}/cantidad-polvo/buscar/`, { 
      params: { rareza, nivel_espiritu: nivelEspiritu } 
    }),
  create: (data) => axios.post(`${API_URL}/cantidad-polvo`, data),
  update: (id, data) => axios.put(`${API_URL}/cantidad-polvo/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/cantidad-polvo/${id}`),
};

export default api;