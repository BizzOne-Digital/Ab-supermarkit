import api from './api';

export const getDeals = () => api.get('/deals').then((r) => r.data);
export const createDeal = (data) => api.post('/deals', data).then((r) => r.data);
export const updateDeal = (id, data) => api.put(`/deals/${id}`, data).then((r) => r.data);
export const deleteDeal = (id) => api.delete(`/deals/${id}`).then((r) => r.data);
