import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Helper to get initial state from localStorage
const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

// Request interceptor to attach JWT token to every axios request
axios.interceptors.request.use(
  (config) => {
    const token = getLocalStorage('buildflow_access_token', null);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAuthStore = create((set, get) => ({
  user: getLocalStorage('buildflow_current_user', null),
  accessToken: getLocalStorage('buildflow_access_token', null),
  isLoading: false,
  isInitialized: false,
  error: null,

  initializeAuth: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isInitialized: true, user: null, accessToken: null });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/me`);
      const user = response.data.data.user;
      set({ user, isInitialized: true, isLoading: false });
      setLocalStorage('buildflow_current_user', user);
    } catch (error) {
      console.error('Session expired or invalid token');
      set({ user: null, accessToken: null, isInitialized: true, isLoading: false });
      localStorage.removeItem('buildflow_current_user');
      localStorage.removeItem('buildflow_access_token');
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { user, tokens } = response.data.data;
      
      set({ user, accessToken: tokens.accessToken, isLoading: false, error: null });
      setLocalStorage('buildflow_current_user', user);
      setLocalStorage('buildflow_access_token', tokens.accessToken);
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/register`, userData);
      
      set({ isLoading: false, error: null });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || err.message || 'Registration failed';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('buildflow_current_user');
    localStorage.removeItem('buildflow_access_token');
    if (axios.defaults.headers.common['Authorization']) {
      delete axios.defaults.headers.common['Authorization'];
    }
    set({ user: null, accessToken: null, error: null });
  },

  resetPassword: async (email, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      set({ isLoading: false, error: 'Password reset requires an email link for security.' });
      return { success: false, error: 'Password reset requires an email link.' };
    } catch (err) {
      set({ isLoading: false, error: 'Reset failed' });
      return { success: false, error: 'Reset failed' };
    }
  },

  clearError: () => set({ error: null }),
}));
