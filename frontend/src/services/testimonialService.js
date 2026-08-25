import api from './api';

export const getTestimonials = () => api.get('/testimonials').then((r) => r.data);
export const createTestimonial = (data) => api.post('/testimonials', data).then((r) => r.data);
export const updateTestimonial = (id, data) => api.put(`/testimonials/${id}`, data).then((r) => r.data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`).then((r) => r.data);
