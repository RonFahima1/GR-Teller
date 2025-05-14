import axios from 'axios';
// import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'; // Temporarily commented out
import { API_CONFIG } from './config';

// Create a new Axios instance with a custom config
export const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    // Add any other default headers here
  }
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use(
  (config: any): any => { // Temporarily using any
    // Get the token from localStorage or your auth state
    const token = localStorage.getItem('token'); 
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => { // Temporarily using any
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors
apiClient.interceptors.response.use(
  (response: any): any => { // Temporarily using any
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: any) => { // Temporarily using any
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      // You can handle specific error codes here globally
      // e.g., if (error.response.status === 401) { /* handle unauthorized */ }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient; 