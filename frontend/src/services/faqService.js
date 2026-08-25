import api from './api';

export const getFaqs = () => api.get('/faqs').then((r) => r.data);
export const createFaq = (data) => api.post('/faqs', data).then((r) => r.data);
export const updateFaq = (id, data) => api.put(`/faqs/${id}`, data).then((r) => r.data);
export const deleteFaq = (id) => api.delete(`/faqs/${id}`).then((r) => r.data);
