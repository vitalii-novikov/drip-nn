import axios, { AxiosResponse } from 'axios';
import { Item, Feedback, EmbeddingResponse, FilterOptions } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://dripnn-backend-26909090947.europe-west1.run.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get items with optional filters
  async getItems(filters?: FilterOptions): Promise<Item[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category) {
        params.append('category', filters.category);
      }
      if (filters?.season) {
        params.append('season', filters.season);
      }
      if (filters?.basecolour) {
        params.append('basecolour', filters.basecolour);
      }
      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.style1) {
        params.append('style1', filters.style1);
      }
      if (filters?.style2) {
        params.append('style2', filters.style2);
      }

      const response: AxiosResponse<Item[]> = await api.get(`/get_items?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      throw new Error('Failed to fetch items');
    }
  },

  // Send feedback (like/dislike)
  async sendFeedback(feedback: Feedback): Promise<void> {
    try {
      await api.post('/feedback', feedback);
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw new Error('Failed to send feedback');
    }
  },

  // Upload image and get style predictions
  async uploadImage(file: FormData, userId: number): Promise<EmbeddingResponse> {
    try {
      const response: AxiosResponse<EmbeddingResponse> = await api.post('/embeddings', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },
};

export default apiService;