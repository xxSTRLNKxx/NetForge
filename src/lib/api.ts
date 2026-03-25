const API_BASE = '/api';

let authToken: string | null = localStorage.getItem('token');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(data.token);
      return data;
    },

    signup: async (email: string, password: string, full_name?: string) => {
      const data = await fetchAPI('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, full_name }),
      });
      setAuthToken(data.token);
      return data;
    },

    logout: () => {
      setAuthToken(null);
    },

    getUser: () => fetchAPI('/auth/me'),
  },

  setup: {
    status: () => fetchAPI('/setup/status'),
    install: (data: any) => fetchAPI('/setup/install', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },

  health: () => fetchAPI('/health'),

  stats: () => fetchAPI('/stats'),

  getAll: (table: string) => fetchAPI(`/${table}`),

  getOne: (table: string, id: string) => fetchAPI(`/${table}/${id}`),

  create: (table: string, data: any) => fetchAPI(`/${table}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (table: string, id: string, data: any) => fetchAPI(`/${table}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  delete: (table: string, id: string) => fetchAPI(`/${table}/${id}`, {
    method: 'DELETE',
  }),

  users: {
    getAll: () => fetchAPI('/users'),
  },

  activityLog: {
    getAll: () => fetchAPI('/activity_log'),
  },
};

export default api;
