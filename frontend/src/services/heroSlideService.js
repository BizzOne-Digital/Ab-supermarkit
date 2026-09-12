import api from './api';

export const getHeroSlides = (params) => api.get('/hero-slides', { params }).then((r) => r.data);
export const createHeroSlide = (formData) =>
  api.post('/hero-slides', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updateHeroSlide = (id, formData) =>
  api.put(`/hero-slides/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deleteHeroSlide = (id) => api.delete(`/hero-slides/${id}`).then((r) => r.data);
