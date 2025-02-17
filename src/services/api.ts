// src/services/api.ts
import axios from 'axios';
import { config } from '../config/config';

const ENDPOINTS = {
  HEALTH: 'health',
  SET_SETTINGS: 'set-adventure-settings',
  START_ADVENTURE: 'start-adventure',
  STREAM_ADVENTURE: 'stream-adventure',
  STREAM_ACTION: 'stream-action',
  ACTION: 'action'
} as const;

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  }
});

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
  private activeEventSource: EventSource | null = null;

  getFullUrl(endpoint: string): string {
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

  private cleanupEventSource() {
    if (this.activeEventSource) {
      this.activeEventSource.close();
      this.activeEventSource = null;
    }
  }

  // Regular API Methods
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

 // Update these parts in your api.ts file

 async startStreamingAdventure(
  settings: AdventureSettings,
  onMessage: (message: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<() => void> {
  this.cleanupEventSource();
  let connectionAttempts = 0;
  const maxAttempts = 3;
  
  const connectEventSource = async () => {
    try {
      const settingsResponse = await this.setAdventureSettings(settings);
      
      if (!settingsResponse.success) {
        throw new Error('Failed to set adventure settings');
      }
      
      const url = this.getFullUrl(ENDPOINTS.STREAM_ADVENTURE);
      console.log('Creating EventSource with URL:', url);
      
      this.activeEventSource = new EventSource(url, {
        withCredentials: false
      });

      // Set up timeout for initial connection
      const connectionTimeout = setTimeout(() => {
        if (this.activeEventSource?.readyState === EventSource.CONNECTING) {
          this.activeEventSource.close();
          retryConnection();
        }
      }, 5000);

      const retryConnection = () => {
        if (connectionAttempts < maxAttempts) {
          connectionAttempts++;
          console.log(`Retrying connection (attempt ${connectionAttempts}/${maxAttempts})...`);
          setTimeout(connectEventSource, 1000 * connectionAttempts); // Exponential backoff
        } else {
          onError(new Error(`Failed to connect after ${maxAttempts} attempts`));
        }
      };

      let isCompleted = false;

      this.activeEventSource.onopen = () => {
        console.log('SSE Connection opened');
        clearTimeout(connectionTimeout);
        connectionAttempts = 0;
      };

      this.activeEventSource.addEventListener('connected', (event) => {
        console.log('SSE Connection established:', event);
      });

      this.activeEventSource.addEventListener('message', (event) => {
        try {
          console.log('Received message:', event.data);
          if (typeof event.data === 'string') {
            onMessage(event.data);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      this.activeEventSource.addEventListener('error', (event: Event) => {
        console.error('Server reported error:', event);
        this.cleanupEventSource();
        onError(new Error('Server reported an error'));
      });

      this.activeEventSource.addEventListener('done', () => {
        if (!isCompleted) {
          isCompleted = true;
          console.log('Stream completed');
          this.cleanupEventSource();
          onComplete();
        }
      });

      this.activeEventSource.onerror = (event) => {
        clearTimeout(connectionTimeout);
        console.error('SSE Error:', event);
        
        if (this.activeEventSource?.readyState === EventSource.CONNECTING) {
          retryConnection();
        } else {
          onError(new Error('SSE connection failed'));
          this.cleanupEventSource();
        }
      };
    } catch (error) {
      console.error('Error in connectEventSource:', error);
      this.cleanupEventSource();
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  };

  await connectEventSource();
  return () => this.cleanupEventSource();
}

  async streamAction(
    action: string,
    onMessage: (message: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<() => void> {
    this.cleanupEventSource();

    try {
      const url = `${this.getFullUrl(ENDPOINTS.STREAM_ACTION)}?action=${encodeURIComponent(action)}`;
      console.log('Creating EventSource for action with URL:', url);
      
      this.activeEventSource = new EventSource(url, {
        withCredentials: true
      });

      // Connection opened
      this.activeEventSource.onopen = (event) => {
        console.log('Action stream connection opened:', event);
      };

      // Connection established
      this.activeEventSource.addEventListener('connected', (event) => {
        console.log('Action stream connection established:', event.data);
      });

      // Regular message
      this.activeEventSource.onmessage = (event) => {
        try {
          console.log('Received action stream message:', event.data);
          onMessage(event.data);
        } catch (error) {
          console.error('Error processing action message:', error);
        }
      };

      // Stream completed
      this.activeEventSource.addEventListener('done', (event) => {
        console.log('Action stream completed:', event);
        this.cleanupEventSource();
        onComplete();
      });

      // Error handling
      this.activeEventSource.onerror = (event) => {
        console.error('Action stream error details:', {
          readyState: this.activeEventSource?.readyState,
          event: event
        });
        
        if (this.activeEventSource?.readyState === EventSource.CONNECTING) {
          onError(new Error('Unable to connect to the action stream. Please check your connection.'));
        } else {
          onError(new Error('Action stream connection failed'));
        }
        
        this.cleanupEventSource();
      };

      // Return cleanup function
      return () => this.cleanupEventSource();
    } catch (error) {
      this.cleanupEventSource();
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
      return () => {};
    }
  }
}

export const apiService = new ApiService();