import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:5003/api';

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok || !data.success) {
    if (response.status === 401) {
      useAuthStore.getState().logout();
    }
    throw new Error(data.message || 'Request failed');
  }

  return data.data;
};

export default apiFetch;
