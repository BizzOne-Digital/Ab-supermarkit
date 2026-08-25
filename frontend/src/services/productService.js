import api from './api';

export const getProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const getProductBySlug = (slug) => api.get(`/products/${slug}`).then((r) => r.data);
export const createProduct = (formData) =>
  api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
