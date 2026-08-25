import api from './api';

export const getCategories = (params) => api.get('/categories', { params }).then((r) => r.data);
export const getCategory = (idOrSlug) => api.get(`/categories/${idOrSlug}`).then((r) => r.data);
export const createCategory = (formData) =>
  api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateCategory = (id, formData) =>
  api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then((r) => r.data);
