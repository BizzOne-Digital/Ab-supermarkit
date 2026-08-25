import api from './api';

export const getDeliveryLinks = () => api.get('/delivery-links').then((r) => r.data);
export const createDeliveryLink = (data) => api.post('/delivery-links', data).then((r) => r.data);
export const updateDeliveryLink = (id, data) => api.put(`/delivery-links/${id}`, data).then((r) => r.data);
export const deleteDeliveryLink = (id) => api.delete(`/delivery-links/${id}`).then((r) => r.data);
