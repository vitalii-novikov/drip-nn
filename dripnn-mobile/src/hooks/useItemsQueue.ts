import { useState, useCallback, useRef } from 'react';
import { Item, FilterOptions } from '../types';
import { apiService } from '../services/api';

interface ItemsQueueState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export const useItemsQueue = () => {
  const [state, setState] = useState<ItemsQueueState>({
    items: [],
    isLoading: false,
    error: null,
    hasMore: true,
  });

  const currentFilters = useRef<FilterOptions>({});
  const isLoadingRef = useRef(false);

  const loadMoreItems = useCallback(async (filters?: FilterOptions) => {
    // Если переданы новые фильтры, сбрасываем очередь
    if (filters && JSON.stringify(filters) !== JSON.stringify(currentFilters.current)) {
      setState({
        items: [],
        isLoading: true,
        error: null,
        hasMore: true,
      });
      currentFilters.current = filters;
    }

    // Предотвращаем множественные запросы
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const newItems = await apiService.getItems(currentFilters.current);
      
      setState(prev => ({
        items: [...prev.items, ...newItems],
        isLoading: false,
        error: null,
        hasMore: newItems.length > 0, // Если получили пустой массив, значит больше нет данных
      }));
    } catch (error) {
      console.error('Error loading items:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load items',
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const getNextItem = useCallback((): Item | null => {
    if (state.items.length === 0) {
      return null;
    }
    return state.items[0];
  }, [state.items]);

  const removeFirstItem = useCallback(() => {
    setState(prev => ({
      ...prev,
      items: prev.items.slice(1),
    }));
  }, []);

  const clearQueue = useCallback(() => {
    setState({
      items: [],
      isLoading: false,
      error: null,
      hasMore: true,
    });
    currentFilters.current = {};
  }, []);

  const applyFilters = useCallback(async (filters: FilterOptions) => {
    await loadMoreItems(filters);
  }, [loadMoreItems]);

  return {
    ...state,
    loadMoreItems,
    getNextItem,
    removeFirstItem,
    clearQueue,
    applyFilters,
  };
};