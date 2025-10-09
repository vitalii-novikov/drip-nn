import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Item, FilterOptions } from '../types';
import { apiService } from '../services/api';
import { useUser } from '../context/UserContext';
import { useItemCache } from '../hooks/useItemCache';
import { useFeedback } from '../hooks/useFeedback';
import { ItemCard } from '../components/ItemCard';
import { FilterModal } from '../components/FilterModal';

export const SwipeScreen: React.FC = () => {
  const { state: userState } = useUser();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [swiperKey, setSwiperKey] = useState(0);

  const { addViewedItem, filterUnviewedItems } = useItemCache(userState.user?.id || 0);
  const { sendFeedback } = useFeedback(userState.user?.id || 0);

  const loadItems = useCallback(async () => {
    if (!userState.user) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedItems = await apiService.getItems(filters);
      setItems(fetchedItems);
      
      // Filter out viewed items
      const unviewedItems = filterUnviewedItems(fetchedItems);
      setFilteredItems(unviewedItems);
    } catch (err) {
      console.error('Error loading items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, userState.user, filterUnviewedItems]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSwipeRight = async (cardIndex: number) => {
    const item = filteredItems[cardIndex];
    if (!item || !userState.user) return;

    try {
      await addViewedItem(item.id);
      await sendFeedback(item, 'like');
    } catch (error) {
      console.error('Error handling like:', error);
      Alert.alert('Error', 'Failed to save your like. Please try again.');
    }
  };

  const handleSwipeLeft = async (cardIndex: number) => {
    const item = filteredItems[cardIndex];
    if (!item || !userState.user) return;

    try {
      await addViewedItem(item.id);
      await sendFeedback(item, 'dislike');
    } catch (error) {
      console.error('Error handling dislike:', error);
      Alert.alert('Error', 'Failed to save your dislike. Please try again.');
    }
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSwiperKey(prev => prev + 1); // Reset swiper when filters change
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    loadItems();
  };

  const renderCard = (item: Item) => {
    if (!item) return null;
    return <ItemCard item={item} />;
  };

  const renderNoMoreCards = () => (
    <View style={styles.noMoreContainer}>
      <Text style={styles.noMoreText}>No more items</Text>
      <Text style={styles.noMoreSubtext}>
        You've seen all available items with current filters
      </Text>
      <TouchableOpacity style={styles.clearFiltersButton} onPress={() => setShowFilters(true)}>
        <Text style={styles.clearFiltersText}>Change Filters</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading items...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadItems}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Style</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {filteredItems.length > 0 ? (
        <Swiper
          key={swiperKey}
          cards={filteredItems}
          renderCard={renderCard}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          onSwipedAll={renderNoMoreCards}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayLabels={{
            left: {
              title: 'DISLIKE',
              style: {
                label: {
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                  borderRadius: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30,
                },
              },
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: '#4ECDC4',
                  color: 'white',
                  fontSize: 24,
                  fontWeight: 'bold',
                  padding: 10,
                  borderRadius: 10,
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30,
                },
              },
            },
          }}
        />
      ) : (
        renderNoMoreCards()
      )}

      <FilterModal
        visible={showFilters}
        onClose={handleApplyFilters}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noMoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  noMoreSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});