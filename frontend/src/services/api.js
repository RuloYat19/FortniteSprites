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
  actualizarPolvos: () => api.post('/sprits/actualizar-polvos'),
};

export const cantidadPolvoExtraerService = {
  getAll: () => axios.get(`${API_URL}/cantidad-polvo-extraer`),
  getById: (id) => axios.get(`${API_URL}/cantidad-polvo-extraer/${id}`),
  getByCombinacion: (rareza, nivelEspiritu) => 
    axios.get(`${API_URL}/cantidad-polvo-extraer/buscar/`, { 
      params: { rareza, nivel_espiritu: nivelEspiritu } 
    }),
  create: (data) => axios.post(`${API_URL}/cantidad-polvo-extraer`, data),
  update: (id, data) => axios.put(`${API_URL}/cantidad-polvo-extraer/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/cantidad-polvo-extraer/${id}`),
};

export const cantidadPolvoInvocarService = {
  getAll: () => axios.get(`${API_URL}/cantidad-polvo-invocar`),
  getById: (id) => axios.get(`${API_URL}/cantidad-polvo-invocar/${id}`),
  getByCombinacion: (material, rareza) => 
    axios.get(`${API_URL}/cantidad-polvo-invocar/buscar/`, { 
      params: { material, rareza } 
    }),
  create: (data) => axios.post(`${API_URL}/cantidad-polvo-invocar`, data),
  update: (id, data) => axios.put(`${API_URL}/cantidad-polvo-invocar/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/cantidad-polvo-invocar/${id}`),
  getByMaterial: (material) => axios.get(`${API_URL}/cantidad-polvo-invocar/material/${material}`),
  getByRareza: (rareza) => axios.get(`${API_URL}/cantidad-polvo-invocar/rareza/${rareza}`),
};

export const materialesService = {
  getAll: () => axios.get(`${API_URL}/materiales`),
  getById: (id) => axios.get(`${API_URL}/materiales/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/materiales/nombre/${nombre}`),
  create: (data) => axios.post(`${API_URL}/materiales`, data),
  update: (id, data) => axios.put(`${API_URL}/materiales/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/materiales/${id}`),
};

export const nombresSpritesService = {
  getAll: () => axios.get(`${API_URL}/nombres-sprites`),
  getById: (id) => axios.get(`${API_URL}/nombres-sprites/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/nombres-sprites/nombre/${nombre}`),
  existe: (nombre) => axios.get(`${API_URL}/nombres-sprites/existe/${nombre}`),
  buscar: (texto) => axios.get(`${API_URL}/nombres-sprites/buscar/${texto}`),
  create: (data) => axios.post(`${API_URL}/nombres-sprites`, data),
  createBatch: (data) => axios.post(`${API_URL}/nombres-sprites/batch`, data),
  update: (id, data) => axios.put(`${API_URL}/nombres-sprites/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/nombres-sprites/${id}`),
};

export const ordenDefaultService = {
  getAll: () => axios.get(`${API_URL}/orden-default`),
  getById: (id) => axios.get(`${API_URL}/orden-default/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/orden-default/nombre/${nombre}`),
  existe: (nombre) => axios.get(`${API_URL}/orden-default/existe/${nombre}`),
  create: (data) => axios.post(`${API_URL}/orden-default`, data),
  createBatch: (data) => axios.post(`${API_URL}/orden-default/batch`, data),
  update: (id, data) => axios.put(`${API_URL}/orden-default/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/orden-default/${id}`),
};

export const ordenRarezaService = {
  getAll: () => axios.get(`${API_URL}/orden-rareza`),
  getById: (id) => axios.get(`${API_URL}/orden-rareza/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/orden-rareza/nombre/${nombre}`),
  existe: (nombre) => axios.get(`${API_URL}/orden-rareza/existe/${nombre}`),
  create: (data) => axios.post(`${API_URL}/orden-rareza`, data),
  createBatch: (data) => axios.post(`${API_URL}/orden-rareza/batch`, data),
  update: (id, data) => axios.put(`${API_URL}/orden-rareza/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/orden-rareza/${id}`),
};

export const backupService = {
  generarBackup: (incluirId = false) => {
    const params = new URLSearchParams();
    if (incluirId) params.append('incluir_id', 'true');
    const url = `${API_URL}/backup/generar${params.toString() ? '?' + params.toString() : ''}`;
    return axios.get(url, {
      responseType: 'blob',
    });
  },
  
  generarBackupTabla: (tablaNombre, incluirId = false) => {
    const params = new URLSearchParams();
    if (incluirId) params.append('incluir_id', 'true');
    const url = `${API_URL}/backup/tabla/${tablaNombre}${params.toString() ? '?' + params.toString() : ''}`;
    return axios.get(url, {
      responseType: 'blob',
    });
  },
  
  getInfo: () => axios.get(`${API_URL}/backup/info`),
};

export const metodoSubidaNivelService = {
  getAll: () => axios.get(`${API_URL}/metodo-subida-nivel`),
  getById: (id) => axios.get(`${API_URL}/metodo-subida-nivel/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/metodo-subida-nivel/nombre/${nombre}`),
  existe: (nombre) => axios.get(`${API_URL}/metodo-subida-nivel/existe/${nombre}`),
  create: (data) => axios.post(`${API_URL}/metodo-subida-nivel`, data),
  createBatch: (data) => axios.post(`${API_URL}/metodo-subida-nivel/batch`, data),
  update: (id, data) => axios.put(`${API_URL}/metodo-subida-nivel/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/metodo-subida-nivel/${id}`),
};


export default api;