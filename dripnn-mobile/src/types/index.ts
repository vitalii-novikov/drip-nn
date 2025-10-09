export interface Item {
  id: number;
  link: string;
  name: string;
  description: string;
  gender?: 'Male' | 'Female';
  category?: 'Topwear' | 'Bottomwear';
  season?: 'Fall' | 'Summer' | 'Winter' | 'Spring';
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
  gender?: 'Male' | 'Female';
  category?: 'Topwear' | 'Bottomwear';
  season?: 'Fall' | 'Summer' | 'Winter' | 'Spring';
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