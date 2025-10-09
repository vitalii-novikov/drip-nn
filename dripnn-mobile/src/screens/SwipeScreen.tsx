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
import { useUser } from '../context/UserContext';
import { useItemCache } from '../hooks/useItemCache';
import { useFeedback } from '../hooks/useFeedback';
import { useItemsQueue } from '../hooks/useItemsQueue';
import { ItemCard } from '../components/ItemCard';
import { FilterModal } from '../components/FilterModal';
import { FilterBar } from '../components/FilterBar';

export const SwipeScreen: React.FC = () => {
  const { state: userState } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [swiperKey, setSwiperKey] = useState(0);

  const { addViewedItem, filterUnviewedItems } = useItemCache(userState.user?.id || 0);
  const { sendFeedback } = useFeedback(userState.user?.id || 0);
  const {
    items,
    isLoading,
    error,
    hasMore,
    loadMoreItems,
    getNextItem,
    removeFirstItem,
    applyFilters,
  } = useItemsQueue();

  // Загружаем первые вещи при монтировании
  useEffect(() => {
    if (userState.user && items.length === 0 && !isLoading) {
      loadMoreItems();
    }
  }, [userState.user, items.length, isLoading, loadMoreItems]);

  const handleSwipeRight = async (cardIndex: number) => {
    const item = getNextItem();
    if (!item || !userState.user) return;

    try {
      await addViewedItem(item.id);
      await sendFeedback(item, 'like');
      removeFirstItem();
      
      // Загружаем больше вещей если очередь почти пустая
      if (items.length <= 3 && hasMore && !isLoading) {
        loadMoreItems();
      }
    } catch (error) {
      console.error('Error handling like:', error);
      Alert.alert('Error', 'Failed to save your like. Please try again.');
    }
  };

  const handleSwipeLeft = async (cardIndex: number) => {
    const item = getNextItem();
    if (!item || !userState.user) return;

    try {
      await addViewedItem(item.id);
      await sendFeedback(item, 'dislike');
      removeFirstItem();
      
      // Загружаем больше вещей если очередь почти пустая
      if (items.length <= 3 && hasMore && !isLoading) {
        loadMoreItems();
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
      Alert.alert('Error', 'Failed to save your dislike. Please try again.');
    }
  };

  const handleApplyFilters = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setSwiperKey(prev => prev + 1); // Reset swiper when filters change
    await applyFilters(newFilters);
    setShowFilters(false);
  };

  const renderCard = (item: Item) => {
    if (!item) return null;
    return <ItemCard item={item} />;
  };

  const renderNoMoreCards = () => (
    <View style={styles.noMoreContainer}>
      <Text style={styles.noMoreText}>No more items</Text>
      <Text style={styles.noMoreSubtext}>
        {hasMore 
          ? "Loading more items..." 
          : "You've seen all available items with current filters"
        }
      </Text>
      {hasMore && (
        <TouchableOpacity 
          style={styles.loadMoreButton} 
          onPress={() => loadMoreItems()}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        style={styles.clearFiltersButton} 
        onPress={() => setShowFilters(true)}
      >
        <Text style={styles.clearFiltersText}>Change Filters</Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadMoreItems()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Style</Text>
      </View>

      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onOpenModal={() => setShowFilters(true)}
      />

      {items.length > 0 ? (
        <Swiper
          key={swiperKey}
          cards={items}
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
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading items...</Text>
        </View>
      ) : (
        renderNoMoreCards()
      )}

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
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
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    marginBottom: 16,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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