import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const vehicleAPI = {
  getAll: () => API.get('/vehicles'),
  getById: (id) => API.get(`/vehicles/${id}`),
  add: (data) => API.post('/vehicles', data),
  update: (id, data) => API.put(`/vehicles/${id}`, data),
  delete: (id) => API.delete(`/vehicles/${id}`),
};
