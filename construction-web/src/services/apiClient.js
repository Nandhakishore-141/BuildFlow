import axios from 'axios';

// Resolve the backend API base URL from Vite environment variables (falling back to local server)
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim().replace(/\/+$/, '');

// Normalize URL: handles both 'https://...onrender.com' and 'https://...onrender.com/api'
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
export const API_URL = `${API_BASE_URL}/api`;

export default axios;
