import api from './api';
import Cookies from 'js-cookie';

export const loadCSRFToken = async () => {
  try {
    // Get CSRF token from server
    const response = await api.get('/api/accounts/csrf/');
    const { csrfToken } = response.data;
    
    // Store CSRF token in cookie (Django will also set it automatically)
    if (csrfToken) {
      Cookies.set('csrftoken', csrfToken, {
        path: '/',
        sameSite: 'Lax',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    
    return csrfToken;
  } catch (error) {
    console.error('Failed to load CSRF token:', error);
    return null;
  }
};

export const getCSRFToken = () => {
  return Cookies.get('csrftoken');
};

export const ensureCSRFToken = async () => {
  const token = getCSRFToken();
  if (!token) {
    return await loadCSRFToken();
  }
  return token;
};