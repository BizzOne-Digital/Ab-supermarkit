import api from './api';

export const getSyncStatus = () => api.get('/clover/sync-status').then((r) => r.data);
export const triggerSync = () => api.post('/clover/sync').then((r) => r.data);
