import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('supabase_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Entity API wrapper for common CRUD operations
const createEntityAPI = (endpoint) => ({
  list: async (sort = '-created_date', limit = 100) => {
    const response = await api.get(`/${endpoint}`, {
      params: { sort, limit }
    });
    return response.data.data || response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data.data || response.data;
  },
  
  create: async (data) => {
    const response = await api.post(`/${endpoint}`, data);
    return response.data.data || response.data;
  },
  
  update: async (id, data) => {
    const response = await api.patch(`/${endpoint}/${id}`, data);
    return response.data.data || response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  },
});

// Add entity methods to api object
api.entities = {
  Client: createEntityAPI('clients'),
  Lead: createEntityAPI('leads'),
  Itinerary: createEntityAPI('itineraries'),
  Invoice: createEntityAPI('invoices'),
  Agency: createEntityAPI('agencies'),
};

export default api;
