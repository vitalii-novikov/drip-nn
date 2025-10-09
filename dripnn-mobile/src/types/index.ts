export interface Item {
  id: number;
  name: string;
  url: string;
  style1: string;
  style2: string;
  category: string;
  type: string;
  basecolour: string;
  season: string;
}

export interface Feedback {
  item_id: number;
  user_id: number;
  feedback: 'like' | 'dislike';
}

export interface EmbeddingResponse {
  styles: string[];
}

export interface User {
  id: number;
  nickname?: string;
  password?: string;
}

export interface FilterOptions {
  category?: string;
  season?: string;
  basecolour?: string;
  type?: string;
  style1?: string;
  style2?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}