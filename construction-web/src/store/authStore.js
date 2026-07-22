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

export const useAuthStore = create((set) => ({
  user: getLocalStorage('buildflow_current_user', null),
  accessToken: getLocalStorage('buildflow_access_token', null),
  isLoading: false,
  error: null,

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
    set({ user: null, accessToken: null, error: null });
    localStorage.removeItem('buildflow_current_user');
    localStorage.removeItem('buildflow_access_token');
  },

  resetPassword: async (email, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      // For now, if the user tries to reset directly
      set({ isLoading: false, error: 'Password reset requires an email link for security.' });
      return { success: false, error: 'Password reset requires an email link.' };
    } catch (err) {
      set({ isLoading: false, error: 'Reset failed' });
      return { success: false, error: 'Reset failed' };
    }
  },

  clearError: () => set({ error: null }),
}));
