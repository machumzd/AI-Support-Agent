import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data).then((res) => res.data),
  signup: (data) => api.post('/auth/signup', data).then((res) => res.data),
  getMe: () => api.get('/auth/me').then((res) => res.data)
};

export const chatApi = {
  send: (message) => api.post('/chat/send', { message }).then((res) => res.data),
  getHistory: () => api.get('/chat/history').then((res) => res.data),
  clearHistory: () => api.delete('/chat/history').then((res) => res.data)
};

export default api;
