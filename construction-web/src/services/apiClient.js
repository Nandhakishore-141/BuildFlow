import axios from 'axios';

// PRODUCTION backend fallback URL on Render
const PRODUCTION_API_URL = 'https://buildflow-2h2d.onrender.com';
const LOCAL_API_URL = 'http://localhost:5000';

/**
 * Dynamically resolves the API base URL:
 * 1. Explicit environment variable (VITE_API_URL / REACT_APP_API_URL)
 * 2. Hostname detection: If not running on localhost/127.0.0.1, always default to the live Render backend
 * 3. Vite production mode flag (import.meta.env.PROD)
 * 4. Local development fallback (http://localhost:5000)
 */
const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  // Runtime check for browser environment
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
    if (!isLocalhost) {
      return PRODUCTION_API_URL;
    }
  }

  if (import.meta.env.PROD) {
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
};

const rawUrl = resolveBaseUrl().replace(/\/+$/, '');

// Normalize URL: handles both 'https://...onrender.com' and 'https://...onrender.com/api'
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl;
export const API_URL = `${API_BASE_URL}/api`;

// Set default axios base URL for any relative endpoint requests
axios.defaults.baseURL = API_BASE_URL;

export default axios;
