import api from './api';

export const submitContactForm = (data) => api.post('/contact', data).then((r) => r.data);
export const getContactSubmissions = () => api.get('/contact').then((r) => r.data);
