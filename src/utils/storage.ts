import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '../types';

const STORAGE_KEYS = {
  LIKED_ITEMS: 'liked_items',
  DISLIKED_ITEMS: 'disliked_items',
};

export const StorageService = {
  // Сохранение лайкнутых вещей
  async saveLikedItem(itemId: string): Promise<void> {
    try {
      const existingLiked = await this.getLikedItems();
      const updatedLiked = [...existingLiked, itemId];
      await AsyncStorage.setItem(STORAGE_KEYS.LIKED_ITEMS, JSON.stringify(updatedLiked));
    } catch (error) {
      console.error('Error saving liked item:', error);
    }
  },

  // Сохранение дизлайкнутых вещей
  async saveDislikedItem(itemId: string): Promise<void> {
    try {
      const existingDisliked = await this.getDislikedItems();
      const updatedDisliked = [...existingDisliked, itemId];
      await AsyncStorage.setItem(STORAGE_KEYS.DISLIKED_ITEMS, JSON.stringify(updatedDisliked));
    } catch (error) {
      console.error('Error saving disliked item:', error);
    }
  },

  // Получение лайкнутых вещей
  async getLikedItems(): Promise<string[]> {
    try {
      const likedItems = await AsyncStorage.getItem(STORAGE_KEYS.LIKED_ITEMS);
      return likedItems ? JSON.parse(likedItems) : [];
    } catch (error) {
      console.error('Error getting liked items:', error);
      return [];
    }
  },

  // Получение дизлайкнутых вещей
  async getDislikedItems(): Promise<string[]> {
    try {
      const dislikedItems = await AsyncStorage.getItem(STORAGE_KEYS.DISLIKED_ITEMS);
      return dislikedItems ? JSON.parse(dislikedItems) : [];
    } catch (error) {
      console.error('Error getting disliked items:', error);
      return [];
    }
  },

  // Получение всех предпочтений пользователя
  async getUserPreferences(): Promise<UserPreferences> {
    const [likedItems, dislikedItems] = await Promise.all([
      this.getLikedItems(),
      this.getDislikedItems(),
    ]);
    return { likedItems, dislikedItems };
  },

  // Очистка всех данных
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.LIKED_ITEMS, STORAGE_KEYS.DISLIKED_ITEMS]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },
};