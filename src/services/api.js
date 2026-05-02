import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const courseService = {
  getAll: (search = '') => api.get(`/courses${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  create: (courseData) => api.post('/courses', courseData),
};

export const userService = {
  getDashboard: () => api.get('/user/dashboard'),
  updateProgress: (courseId, moduleId) => api.put(`/progress/${courseId}`, { moduleId }),
};

export default api;
