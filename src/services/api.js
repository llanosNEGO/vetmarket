import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});


export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
};

export const userService = {
  getStats: () => 
    api.get('/users/stats'),
  
  getAll: () => 
    api.get('/users'),
  
  getProfile: () => 
    api.get('/users/profile'),
  
  updateProfile: (userData) => 
    api.put('/users/profile', userData),
};

export const healthService = {
  check: () => 
    api.get('/health'),
  
  checkAuth: () => 
    api.get('/auth/health'),
};

export default api;