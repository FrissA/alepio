// API Response Types

export interface User {
  id: string;
  githubId: string;
  username: string;
  avatarUrl?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Score {
  id: string;
  score: number;
  userId?: string;
  guestUuid?: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TopScoresResponse {
  scores: Score[];
  total: number;
}

export interface SubmitScoreRequest {
  score: number;
}

export interface SubmitScoreResponse {
  score: Score;
  message: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
