import api from './api';

export const getPartners = (params) => api.get('/partners', { params }).then((r) => r.data);
export const createPartner = (formData) =>
  api.post('/partners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const updatePartner = (id, formData) =>
  api.put(`/partners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const deletePartner = (id) => api.delete(`/partners/${id}`).then((r) => r.data);
