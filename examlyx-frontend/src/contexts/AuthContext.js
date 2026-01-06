import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('/api/accounts/csrf/');
      const token = response.data.csrfToken;
      setCsrfToken(token);
      axios.defaults.headers.common['X-CSRFToken'] = token;
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/accounts/check-auth/');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await fetchCsrfToken();
      await checkAuth();
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/accounts/login/', {
        username,
        password,
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/accounts/logout/');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    csrfToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};