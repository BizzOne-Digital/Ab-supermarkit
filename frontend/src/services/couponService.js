import api from './api';

export const validateCoupon = (code, subtotal) => api.post('/coupons/validate', { code, subtotal }).then((r) => r.data);
export const getCoupons = () => api.get('/coupons').then((r) => r.data);
export const createCoupon = (data) => api.post('/coupons', data).then((r) => r.data);
export const updateCoupon = (id, data) => api.put(`/coupons/${id}`, data).then((r) => r.data);
export const deleteCoupon = (id) => api.delete(`/coupons/${id}`).then((r) => r.data);
