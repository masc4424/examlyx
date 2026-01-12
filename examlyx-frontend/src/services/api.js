import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookie
    const csrfToken = Cookies.get('csrftoken');
    
    // For POST, PUT, PATCH, DELETE requests, add CSRF token
    if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('CSRF token error or permission denied');
      
      // If it's a CSRF error, try to get a new token
      if (error.response?.data?.detail?.includes('CSRF')) {
        window.location.reload(); // Or fetch new CSRF token
      }
    }
    return Promise.reject(error);
  }
);

export const teacherAPI = {
  getTeachers: () => api.get('/api/accounts/teachers/'),
  getTeacher: (id) => api.get(`/api/accounts/teachers/${id}/`),
  createTeacher: (data) => api.post('/api/accounts/teachers/create/', data),
  updateTeacher: (id, data) => api.put(`/api/accounts/teachers/${id}/`, data),
  deleteTeacher: (id) => api.delete(`/api/accounts/users/${id}/delete/`),
};

export const studentAPI = {
  getStudents: () => api.get('/api/accounts/students/'),
  getStudent: (id) => api.get(`/api/accounts/students/${id}/`),
  createStudent: (data) => api.post('/api/accounts/students/create/', data),
  updateStudent: (id, data) => api.put(`/api/accounts/students/${id}/`, data),
  deleteStudent: (id) => api.delete(`/api/accounts/users/${id}/delete/`),
};

export const userAPI = {
  getUsers: () => api.get('/api/users/'),
  getUser: (id) => api.get(`/api/users/${id}/`),
  getRoles: () => api.get('/api/roles/'),
};

export default api;