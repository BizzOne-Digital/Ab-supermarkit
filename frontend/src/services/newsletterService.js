import api from './api';

export const subscribeNewsletter = (email) => api.post('/newsletter/subscribe', { email }).then((r) => r.data);
export const getNewsletterSubscribers = () => api.get('/newsletter').then((r) => r.data);
