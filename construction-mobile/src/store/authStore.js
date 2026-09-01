import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isImpersonating: false,
  originalAdminUser: null,
  originalAdminToken: null,

  initializeAuth: async () => {
    try {
      const [token, userStr, adminToken, adminUserStr] = await AsyncStorage.multiGet([
        'constructiq_token',
        'constructiq_user',
        'constructiq_admin_token',
        'constructiq_admin_user',
      ]);

      const storedToken = token[1];
      const storedUser = userStr[1] ? JSON.parse(userStr[1]) : null;
      const storedAdminToken = adminToken[1];
      const storedAdminUser = adminUserStr[1] ? JSON.parse(adminUserStr[1]) : null;

      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: storedUser,
          isAuthenticated: true,
          isImpersonating: !!storedAdminToken,
          originalAdminToken: storedAdminToken,
          originalAdminUser: storedAdminUser,
          isLoading: false,
        });
      } else {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      console.error('Failed to initialize auth from storage', e);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { user, tokens } = res.data.data;
    const accessToken = tokens.accessToken;

    await AsyncStorage.multiSet([
      ['constructiq_token', accessToken],
      ['constructiq_user', JSON.stringify(user)],
    ]);

    set({
      user,
      token: accessToken,
      isAuthenticated: true,
      isImpersonating: false,
      originalAdminToken: null,
      originalAdminUser: null,
    });

    return user;
  },

  impersonateUser: async (targetUserId) => {
    const currentAdminUser = get().user;
    const currentAdminToken = get().token;

    const res = await apiClient.post(`/admin/impersonate/${targetUserId}`);
    const { user, tokens } = res.data.data;
    const accessToken = tokens.accessToken;

    await AsyncStorage.multiSet([
      ['constructiq_admin_token', currentAdminToken],
      ['constructiq_admin_user', JSON.stringify(currentAdminUser)],
      ['constructiq_token', accessToken],
      ['constructiq_user', JSON.stringify(user)],
    ]);

    set({
      user,
      token: accessToken,
      isAuthenticated: true,
      isImpersonating: true,
      originalAdminToken: currentAdminToken,
      originalAdminUser: currentAdminUser,
    });

    return user;
  },

  revertImpersonation: async () => {
    const { originalAdminToken, originalAdminUser } = get();
    if (!originalAdminToken || !originalAdminUser) return;

    await AsyncStorage.multiRemove(['constructiq_admin_token', 'constructiq_admin_user']);
    await AsyncStorage.multiSet([
      ['constructiq_token', originalAdminToken],
      ['constructiq_user', JSON.stringify(originalAdminUser)],
    ]);

    set({
      user: originalAdminUser,
      token: originalAdminToken,
      isAuthenticated: true,
      isImpersonating: false,
      originalAdminToken: null,
      originalAdminUser: null,
    });
  },

  logout: async () => {
    try {
      await AsyncStorage.multiRemove([
        'constructiq_token',
        'constructiq_user',
        'constructiq_admin_token',
        'constructiq_admin_user',
      ]);
    } catch (e) {}

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isImpersonating: false,
      originalAdminToken: null,
      originalAdminUser: null,
    });
  },
}));
