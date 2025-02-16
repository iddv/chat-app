// src/services/api.ts
import axios from 'axios';
import { config } from '../config/config';

// API endpoints
const ENDPOINTS = {
  HEALTH: 'health',
  SET_SETTINGS: 'set-adventure-settings',
  START_ADVENTURE: 'start-adventure',
  ACTION: 'action'
} as const;

const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Use proxy in development
  : import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Log configuration in development
if (config.isDevelopment) {
  console.log('API Configuration:', {
    baseUrl: API_BASE_URL,
    timeout: 300000,
    isDevelopment: config.isDevelopment
  });
}

export interface AdventureSettings {
  setting: string;
  genre: string;
  playerCharacter: string;
  theme: string;
  toneStyle: string;
  additionalDetails: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private getFullUrl(endpoint: string): string {
    // Add leading slash if not present
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${cleanEndpoint}`;
  }

  private async handleRequest<T>(
    method: 'get' | 'post',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const url = this.getFullUrl(endpoint);
    try {
      console.log(`Making ${method.toUpperCase()} request to ${url}`);
      
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      
      console.log(`Received response from ${endpoint}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Unable to connect to the server. Please ensure the backend is running.');
        }
        const message = error.response?.data?.error || error.message;
        throw new Error(message);
      }
      throw error;
    }
  }

  async setAdventureSettings(settings: AdventureSettings): Promise<ApiResponse<string>> {
    console.log('Sending settings to backend:', settings);
    return this.handleRequest<string>('post', ENDPOINTS.SET_SETTINGS, settings);
  }

  async startAdventure(settings: AdventureSettings): Promise<ApiResponse<string>> {
    return this.handleRequest<string>('post', ENDPOINTS.START_ADVENTURE, settings);
  }

  async sendAction(action: string): Promise<ApiResponse<string>> {
    return this.handleRequest<string>('post', ENDPOINTS.ACTION, { action });
  }

  async checkHealth(): Promise<ApiResponse<string>> {
    return this.handleRequest<string>('get', ENDPOINTS.HEALTH);
  }
}

export const apiService = new ApiService();