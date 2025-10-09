import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

const VIEWED_ITEMS_KEY = 'viewed_items';

export const useItemCache = (userId: number) => {
  const [viewedItems, setViewedItems] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadViewedItems();
  }, [userId]);

  const loadViewedItems = async () => {
    try {
      const key = `${VIEWED_ITEMS_KEY}_${userId}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const viewedArray = JSON.parse(stored);
        setViewedItems(new Set(viewedArray));
      }
    } catch (error) {
      console.error('Error loading viewed items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addViewedItem = async (itemId: number) => {
    try {
      const newViewedItems = new Set([...viewedItems, itemId]);
      setViewedItems(newViewedItems);
      
      const key = `${VIEWED_ITEMS_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify([...newViewedItems]));
    } catch (error) {
      console.error('Error saving viewed item:', error);
    }
  };

  const clearViewedItems = async () => {
    try {
      setViewedItems(new Set());
      const key = `${VIEWED_ITEMS_KEY}_${userId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing viewed items:', error);
    }
  };

  const filterUnviewedItems = (items: Item[]): Item[] => {
    return items.filter(item => !viewedItems.has(item.id));
  };

  return {
    viewedItems,
    isLoading,
    addViewedItem,
    clearViewedItems,
    filterUnviewedItems,
  };
};