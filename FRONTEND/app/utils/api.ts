const API_URL = 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(data?.detail || 'An error occurred');
    this.status = status;
    this.data = data;
  }
}

async function fetchClient(endpoint: string, options: RequestInit = {}) {
  // CLIENT AUTH FLOW - REQUEST INTERCEPTOR
  // 1. Retrieve the JWT access token from localStorage.
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const headers = new Headers(options.headers);
  // 2. If token is present, append the Authorization Bearer header to secure request
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // CLIENT AUTH FLOW - RESPONSE INTERCEPTOR / GUARD
  // 3. If response returns 401 Unauthorized, the session has expired or is invalid.
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      // 4. Clean up local token storage and redirect the browser to the login screen.
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, data);
  }

  if (response.status === 204) {
    return null;
  }
  
  return response.json();
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchClient(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, body: any, options?: RequestInit) => {
    const isFormData = body instanceof URLSearchParams || body instanceof FormData;
    return fetchClient(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? { ...options?.headers } : undefined,
    });
  },
};
