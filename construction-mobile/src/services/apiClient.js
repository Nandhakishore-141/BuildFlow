import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// In Android Emulator, localhost is reached via 10.0.2.2. In iOS / web, localhost is 127.0.0.1.
export const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000/api',
  ios: 'http://localhost:5000/api',
  default: 'http://localhost:5000/api',
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('constructiq_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to retrieve token from AsyncStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 Unauthorized
      try {
        await AsyncStorage.multiRemove([
          'constructiq_token',
          'constructiq_user',
          'constructiq_admin_token',
          'constructiq_admin_user',
        ]);
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export default apiClient;
