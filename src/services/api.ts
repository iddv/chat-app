// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface AdventureSettings {
  setting: string;
  genre: string;
  playerCharacter: string;
  theme: string;
  toneStyle: string;
  additionalDetails: string;
}

export interface GameState {
  history: string[];
  currentScene: string;
  isInGame: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private sessionId: string | null = null;

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.sessionId && { 'X-Session-ID': this.sessionId }),
    };
  }

  private handleResponse<T>(response: any): T {
    if (response.headers['x-session-id']) {
      this.sessionId = response.headers['x-session-id'];
    }
    return response.data;
  }

  async generateAdventure(settings: AdventureSettings) {
    const response = await axios.post(
      `${API_BASE_URL}/generate-adventure`,
      settings,
      { headers: this.getHeaders() }
    );
    return this.handleResponse<ApiResponse<{ response: string; sessionId: string }>>(response);
  }

  async sendAction(action: string) {
    const response = await axios.post(
      `${API_BASE_URL}/ask`,
      action,
      { headers: this.getHeaders() }
    );
    return this.handleResponse<ApiResponse<{ response: string; sessionId: string }>>(response);
  }

  async getGameState() {
    if (!this.sessionId) return null;
    const response = await axios.get(
      `${API_BASE_URL}/game-state/${this.sessionId}`,
      { headers: this.getHeaders() }
    );
    return this.handleResponse<ApiResponse<GameState>>(response);
  }
}

export const apiService = new ApiService();
