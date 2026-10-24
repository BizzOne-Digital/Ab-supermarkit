import api from './api';

export const getMenuItems = (params) => api.get('/menu-items', { params }).then((r) => r.data);
export const createMenuItem = (formData) =>
  api.post('/menu-items', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateMenuItem = (id, formData) =>
  api.put(`/menu-items/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteMenuItem = (id) => api.delete(`/menu-items/${id}`).then((r) => r.data);
