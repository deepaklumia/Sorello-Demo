const BASE_URL = 'http://localhost:5003/api';

export class FetchError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiRequest = async (path: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('restaurant_token') || sessionStorage.getItem('restaurant_token');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });

    let data: any = null;
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('restaurant_token');
        localStorage.removeItem('restaurant_user');
        localStorage.removeItem('restaurant_slug');
        sessionStorage.removeItem('restaurant_token');
        sessionStorage.removeItem('restaurant_user');
        sessionStorage.removeItem('restaurant_slug');
        
        // Extract active slug from pathname (e.g. /burger-palace/dashboard -> burger-palace)
        const pathParts = window.location.pathname.split('/');
        const activeSlug = pathParts[1] || 'burger-palace';
        
        if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/login') && window.location.pathname !== `/${activeSlug}`) {
          window.location.href = `/${activeSlug}`;
        }
      }
      const errorMessage = data?.message || response.statusText || 'Request failed';
      throw new FetchError(response.status, errorMessage, data);
    }

    return data;
  } catch (error) {
    if (error instanceof FetchError) {
      throw error;
    }
    throw new FetchError(500, error instanceof Error ? error.message : 'Network error');
  }
};

export const api = {
  get: (path: string, options?: RequestInit) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path: string, body: any, options?: RequestInit) =>
    apiRequest(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path: string, body: any, options?: RequestInit) =>
    apiRequest(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path: string, body: any, options?: RequestInit) =>
    apiRequest(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string, options?: RequestInit) => apiRequest(path, { ...options, method: 'DELETE' }),
};
export default api;
