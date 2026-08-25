import api from './api';

export const getOffers = () => api.get('/offers').then((r) => r.data);
export const createOffer = (formData) =>
  api.post('/offers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateOffer = (id, formData) =>
  api.put(`/offers/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteOffer = (id) => api.delete(`/offers/${id}`).then((r) => r.data);
