const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const ASSET_URL = API_URL.replace('/api', '');

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, method = 'GET', body = null, isMultipart = false) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders();
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = isMultipart ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error(`Backend connection failed: ${error.message}`);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, 'GET');
  }

  post(endpoint, body, isMultipart = false) {
    return this.request(endpoint, 'POST', body, isMultipart);
  }

  put(endpoint, body, isMultipart = false) {
    return this.request(endpoint, 'PUT', body, isMultipart);
  }

  delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }
}

export const api = new ApiService();

