import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // Increased timeout to 10 seconds
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

// --- Device APIs ---
export const getDevices = () => api.get('/devices').then((r) => r.data);
export const createDevice = (data) => api.post('/devices', data).then((r) => r.data);
export const updateDevice = (id, data) => api.put(`/devices/${id}`, data).then((r) => r.data);
export const deleteDevice = (id) => api.delete(`/devices/${id}`).then((r) => r.data);
export const testConnection = (deviceId) =>
  api.get(`/devices/test/${deviceId}`).then((r) => r.data);

// --- SMS APIs ---
export const sendSms = (data) => api.post('/send-sms', data).then((r) => r.data);
export const getLogs = (params) => api.get('/logs', { params }).then((r) => r.data);
export const getStats = () => api.get('/stats').then((r) => r.data);
