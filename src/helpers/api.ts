import { useAuthStore } from "@zustand/store";
import type { User, Score, SubmitScoreResponse } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const apiClient = {
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    // Add authorization header if auth is required
    if (requiresAuth) {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("No authentication token available");
      }
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, clear auth
        useAuthStore.getState().clearAuth();
        throw new Error("Authentication expired. Please login again.");
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", requiresAuth });
  },

  post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth,
    });
  },
};

// Specific API methods
export const authAPI = {
  loginUrl: `${API_URL}/auth/github`,
  
  getMe(): Promise<User> {
    return apiClient.get<User>("/users/me", true);
  },
  
  getMyScores(): Promise<Score[]> {
    return apiClient.get<Score[]>("/users/me/scores", true);
  },
};

export const scoresAPI = {
  submitScore(score: number): Promise<SubmitScoreResponse> {
    return apiClient.post<SubmitScoreResponse>("/scores", { score }, true);
  },

  submitGuestScore(score: number, guestUuid: string): Promise<SubmitScoreResponse> {
    return apiClient.post<SubmitScoreResponse>("/scores", { score, guestUuid }, false);
  },

  getTopScores(): Promise<Score[]> {
    return apiClient.get<Score[]>("/scores/top");
  },

  getMyScore(): Promise<Score> {
    return apiClient.get<Score>("/scores/me", true);
  },

  getGuestScore(uuid: string): Promise<Score> {
    return apiClient.get<Score>(`/scores/guest?uuid=${uuid}`);
  },

  getAllScores(): Promise<Score[]> {
    return apiClient.get<Score[]>("/scores");
  },
};

export { API_URL };
