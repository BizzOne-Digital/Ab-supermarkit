import api from './api';

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
export const deleteUploadedImage = (publicId) => api.delete(`/upload/${encodeURIComponent(publicId)}`).then((r) => r.data);
