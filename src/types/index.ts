export interface ClothingItem {
  id: string;
  gender: string;
  masterCategory: string;
  subCategory: string;
  articleType: string;
  baseColour: string;
  season: string;
  year: string;
  usage: string;
  productDisplayName: string;
  filename: string;
  link: string;
  path: string;
  main_style: string;
  secondary_style: string;
}

export interface StyleAnalysis {
  main_style: string;
  secondary_style: string;
  confidence?: number;
}

export interface UserPreferences {
  likedItems: string[];
  dislikedItems: string[];
}

export interface StyleDistribution {
  style: string;
  count: number;
  percentage: number;
}

export type RootTabParamList = {
  Swipe: undefined;
  Profile: undefined;
  MyItem: undefined;
};