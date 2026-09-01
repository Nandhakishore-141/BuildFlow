import { create } from 'zustand';
import axios from 'axios';
import * as adminService from '@/services/adminService';
import { API_URL } from '@/services/apiClient';

const AUTH_API_URL = `${API_URL}/auth`;

// Helper to get initial state from localStorage
const getLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : defaultValue;
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

const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
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
  isImpersonating: getLocalStorage('constructiq_is_impersonating', false),
  originalAdmin: getLocalStorage('constructiq_original_admin', null),
  originalAdminToken: getLocalStorage('constructiq_original_admin_token', null),
  isLoading: false,
  isInitialized: false,
  error: null,

  initializeAuth: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isInitialized: true, user: null, accessToken: null, isImpersonating: false });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await axios.get(`${AUTH_API_URL}/me`);
      const user = response.data.data.user;
      set({ user, isInitialized: true, isLoading: false });
      setLocalStorage('buildflow_current_user', user);
    } catch (error) {
      console.error('Session expired or invalid token');
      // If impersonating and session fails, attempt clean recovery
      if (get().isImpersonating && get().originalAdminToken) {
        const originalToken = get().originalAdminToken;
        const originalAdmin = get().originalAdmin;
        set({
          user: originalAdmin,
          accessToken: originalToken,
          isImpersonating: false,
          originalAdmin: null,
          originalAdminToken: null,
          isInitialized: true,
          isLoading: false
        });
        setLocalStorage('buildflow_current_user', originalAdmin);
        setLocalStorage('buildflow_access_token', originalToken);
        removeLocalStorage('constructiq_is_impersonating');
        removeLocalStorage('constructiq_original_admin');
        removeLocalStorage('constructiq_original_admin_token');
      } else {
        set({ user: null, accessToken: null, isImpersonating: false, isInitialized: true, isLoading: false });
        removeLocalStorage('buildflow_current_user');
        removeLocalStorage('buildflow_access_token');
        removeLocalStorage('constructiq_is_impersonating');
        removeLocalStorage('constructiq_original_admin');
        removeLocalStorage('constructiq_original_admin_token');
      }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });
      const { user, tokens } = response.data.data;
      
      set({ 
        user, 
        accessToken: tokens.accessToken, 
        isImpersonating: false, 
        originalAdmin: null,
        originalAdminToken: null,
        isLoading: false, 
        error: null 
      });
      setLocalStorage('buildflow_current_user', user);
      setLocalStorage('buildflow_access_token', tokens.accessToken);
      removeLocalStorage('constructiq_is_impersonating');
      removeLocalStorage('constructiq_original_admin');
      removeLocalStorage('constructiq_original_admin_token');
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      const errors = err.response?.data?.errors;
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg, errors };
    }
  },

  startImpersonation: async (targetUserId) => {
    const currentAdmin = get().user;
    const currentToken = get().accessToken;
    set({ isLoading: true, error: null });

    try {
      const res = await adminService.impersonateUser(targetUserId);
      const { user: targetUser, tokens, originalAdmin } = res.data;

      set({
        user: targetUser,
        accessToken: tokens.accessToken,
        isImpersonating: true,
        originalAdmin: originalAdmin || currentAdmin,
        originalAdminToken: currentToken,
        isLoading: false,
        error: null
      });

      setLocalStorage('buildflow_current_user', targetUser);
      setLocalStorage('buildflow_access_token', tokens.accessToken);
      setLocalStorage('constructiq_is_impersonating', true);
      setLocalStorage('constructiq_original_admin', originalAdmin || currentAdmin);
      setLocalStorage('constructiq_original_admin_token', currentToken);

      return { success: true, targetRole: targetUser.role };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to start impersonation';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  stopImpersonation: async () => {
    set({ isLoading: true, error: null });
    try {
      let resData = null;
      try {
        const res = await adminService.stopImpersonation();
        resData = res.data;
      } catch (e) {
        console.warn("Backend stop impersonation call warning, restoring client backup token:", e.message);
      }

      const adminUser = resData?.user || get().originalAdmin || { role: 'Admin' };
      const adminToken = resData?.tokens?.accessToken || get().originalAdminToken;

      set({
        user: adminUser,
        accessToken: adminToken,
        isImpersonating: false,
        originalAdmin: null,
        originalAdminToken: null,
        isLoading: false,
        error: null
      });

      setLocalStorage('buildflow_current_user', adminUser);
      setLocalStorage('buildflow_access_token', adminToken);
      removeLocalStorage('constructiq_is_impersonating');
      removeLocalStorage('constructiq_original_admin');
      removeLocalStorage('constructiq_original_admin_token');

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to stop impersonation';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${AUTH_API_URL}/register`, userData);
      set({ isLoading: false, error: null });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      const errors = err.response?.data?.errors;
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg, errors };
    }
  },

  logout: () => {
    removeLocalStorage('buildflow_current_user');
    removeLocalStorage('buildflow_access_token');
    removeLocalStorage('constructiq_is_impersonating');
    removeLocalStorage('constructiq_original_admin');
    removeLocalStorage('constructiq_original_admin_token');
    if (axios.defaults.headers.common['Authorization']) {
      delete axios.defaults.headers.common['Authorization'];
    }
    set({ user: null, accessToken: null, isImpersonating: false, originalAdmin: null, originalAdminToken: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
