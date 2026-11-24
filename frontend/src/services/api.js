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

export const droidesService = {
  getAll: (params = {}) => api.get('/droides/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/droides/', data),
  update: (id, data) => api.put(`/droides/${id}`, data),
  delete: (id) => api.delete(`/droides/${id}`),
};

export const fusionesService = {
  getAll: (params = {}) => api.get('/fusiones/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/fusiones/', data),
  update: (id, data) => api.put(`/fusiones/${id}`, data),
  delete: (id) => api.delete(`/fusiones/${id}`),
};

export const reglasFusionService = {
  getAll: (params = {}) => api.get('/reglas-fusion/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/reglas-fusion/', data),
  update: (id, data) => api.put(`/reglas-fusion/${id}`, data),
  delete: (id) => api.delete(`/reglas-fusion/${id}`),
};

export const materialDroidTycoonService = {
  getAll: (params = {}) => api.get('/materiales-droid-tycoon/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/materiales-droid-tycoon/', data),
  update: (id, data) => api.put(`/materiales-droid-tycoon/${id}`, data),
  delete: (id) => api.delete(`/materiales-droid-tycoon/${id}`),
};

export const materialesDroideService = {
  getAll: (params = {}) => api.get('/materiales-droide/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/materiales-droide/', data),
  update: (id, data) => api.put(`/materiales-droide/${id}`, data),
};

export const nombresDroidesService = {
  getAll: (params = {}) => api.get('/nombres-droides/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/nombres-droides/', data),
  update: (id, data) => api.put(`/nombres-droides/${id}`, data),
  delete: (id) => api.delete(`/nombres-droides/${id}`),
};

export const rarezasDroidesService = {
  getAll: (params = {}) => api.get('/rareza-droides/', {
    params: { limit: 1000, ...params },
  }),
  create: (data) => api.post('/rareza-droides/', data),
  update: (id, data) => api.put(`/rareza-droides/${id}`, data),
  delete: (id) => api.delete(`/rareza-droides/${id}`),
};

export const creditosPorSegundoService = {
  getAll: () => api.get('/creditos-por-segundo/', { params: { limit: 1000 } }),
  create: (data) => api.post('/creditos-por-segundo/', data),
  update: (id, data) => api.put(`/creditos-por-segundo/${id}`, data),
  delete: (id) => api.delete(`/creditos-por-segundo/${id}`),
};

export const chipsVentaDroideService = {
  getAll: () => api.get('/chips-venta-droide/', { params: { limit: 1000 } }),
  create: (data) => api.post('/chips-venta-droide/', data),
  update: (id, data) => api.put(`/chips-venta-droide/${id}`, data),
  delete: (id) => api.delete(`/chips-venta-droide/${id}`),
};

export const kyberActivarDroideService = {
  getAll: () => api.get('/kyber-activar-droide/', { params: { limit: 1000 } }),
  create: (data) => api.post('/kyber-activar-droide/', data),
  update: (id, data) => api.put(`/kyber-activar-droide/${id}`, data),
  delete: (id) => api.delete(`/kyber-activar-droide/${id}`),
};

export const cantidadPolvoExtraerService = {
  getAll: () => axios.get(`${API_URL}/cantidad-polvo-extraer`),
  getById: (id) => axios.get(`${API_URL}/cantidad-polvo-extraer/${id}`),
  getByCombinacion: (material, rareza, nivelEspiritu) =>
    axios.get(`${API_URL}/cantidad-polvo-extraer/buscar/`, { 
      params: { material, rareza, nivel_espiritu: nivelEspiritu }
    }),
  create: (data) => axios.post(`${API_URL}/cantidad-polvo-extraer`, data),
  update: (id, data) => axios.put(`${API_URL}/cantidad-polvo-extraer/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/cantidad-polvo-extraer/${id}`),
  getByCombinacionConFallback: (material, rareza, nivelEspiritu, temporada) =>
  axios.get(`${API_URL}/cantidad-polvo-extraer/buscar-con-fallback/`, { 
    params: { material, rareza, nivel_espiritu: nivelEspiritu, ...(temporada && { temporada })} 
  }),
};

export const cantidadPolvoInvocarService = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axios.get(`${API_URL}/cantidad-polvo-invocar${queryString ? `?${queryString}` : ''}`);
  },
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
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axios.get(`${API_URL}/materiales${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => axios.get(`${API_URL}/materiales/${id}`),
  getByNombre: (nombre) => axios.get(`${API_URL}/materiales/nombre/${nombre}`),
  create: (data) => axios.post(`${API_URL}/materiales`, data),
  update: (id, data) => axios.put(`${API_URL}/materiales/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/materiales/${id}`),
};

export const nombresSpritesService = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return axios.get(`${API_URL}/nombres-sprites${queryString ? `?${queryString}` : ''}`);
  },
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