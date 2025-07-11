const API_BASE_URL = 'http://localhost:3020/api';

export const API_ENDPOINTS = {
  // User endpoints
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  },
  // Product endpoints
  PRODUCTS: {
    BASE: `${API_BASE_URL}/products`,
    BY_ID: (id) => `${API_BASE_URL}/products/${id}`,
  },
  // Order endpoints
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    BY_ID: (id) => `${API_BASE_URL}/orders/${id}`,
  },
  // Auth endpoints (using user routes for now)
  AUTH: {
    REGISTER: `${API_BASE_URL}/users`,
    LOGIN: `${API_BASE_URL}/users/login`,
    PROFILE: (userId) => `${API_BASE_URL}/users/${userId}`,
  }
};

export const apiRequest = async (url, options = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    console.log(`Making ${options.method || 'GET'} request to:`, url);
    console.log('Request options:', {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Important for cookies, authorization headers
    });

    console.log('Response status:', response.status);
    
    // Handle empty responses
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn('Non-JSON response:', text);
      throw new Error('Received non-JSON response from server');
    }

    console.log('Response data:', data);

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', {
      message: error.message,
      status: error.status,
      data: error.data,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
    
    // Improve error message for network errors
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};
