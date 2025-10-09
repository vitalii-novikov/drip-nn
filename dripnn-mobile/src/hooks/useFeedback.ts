import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';
import { apiService } from '../services/api';

const LIKED_ITEMS_KEY = 'liked_items';
const DISLIKED_ITEMS_KEY = 'disliked_items';

export const useFeedback = (userId: number) => {
  const [likedItems, setLikedItems] = useState<Item[]>([]);
  const [dislikedItems, setDislikedItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbackData();
  }, [userId]);

  const loadFeedbackData = async () => {
    try {
      const likedKey = `${LIKED_ITEMS_KEY}_${userId}`;
      const dislikedKey = `${DISLIKED_ITEMS_KEY}_${userId}`;
      
      const [likedStored, dislikedStored] = await Promise.all([
        AsyncStorage.getItem(likedKey),
        AsyncStorage.getItem(dislikedKey),
      ]);

      if (likedStored) {
        setLikedItems(JSON.parse(likedStored));
      }
      if (dislikedStored) {
        setDislikedItems(JSON.parse(dislikedStored));
      }
    } catch (error) {
      console.error('Error loading feedback data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFeedback = async (item: Item, feedback: 'like' | 'dislike') => {
    try {
      // Send to API
      await apiService.sendFeedback({
        item_id: item.id,
        user_id: userId,
        feedback,
      });

      // Update local state
      if (feedback === 'like') {
        const newLikedItems = [...likedItems, item];
        setLikedItems(newLikedItems);
        await AsyncStorage.setItem(
          `${LIKED_ITEMS_KEY}_${userId}`,
          JSON.stringify(newLikedItems)
        );
      } else {
        const newDislikedItems = [...dislikedItems, item];
        setDislikedItems(newDislikedItems);
        await AsyncStorage.setItem(
          `${DISLIKED_ITEMS_KEY}_${userId}`,
          JSON.stringify(newDislikedItems)
        );
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      throw error;
    }
  };

  const clearFeedback = async () => {
    try {
      setLikedItems([]);
      setDislikedItems([]);
      
      const likedKey = `${LIKED_ITEMS_KEY}_${userId}`;
      const dislikedKey = `${DISLIKED_ITEMS_KEY}_${userId}`;
      
      await Promise.all([
        AsyncStorage.removeItem(likedKey),
        AsyncStorage.removeItem(dislikedKey),
      ]);
    } catch (error) {
      console.error('Error clearing feedback:', error);
    }
  };

  const getStyleDistribution = () => {
    const styleCount: { [key: string]: number } = {};
    
    likedItems.forEach(item => {
      // Используем style1 и style2 для анализа предпочтений
      const styles = [item.style1, item.style2].filter(Boolean);
      styles.forEach(style => {
        styleCount[style] = (styleCount[style] || 0) + 1;
      });
    });

    return Object.entries(styleCount).map(([style, count]) => ({
      style,
      count,
      percentage: (count / likedItems.length) * 100,
    }));
  };

  return {
    likedItems,
    dislikedItems,
    isLoading,
    sendFeedback,
    clearFeedback,
    getStyleDistribution,
  };
};