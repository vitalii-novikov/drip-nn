import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { ClothingCard } from '../components/ClothingCard';
import { ClothingItem } from '../types';
import { loadClothingData } from '../utils/csvParser';
import { StorageService } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export const SwipeScreen: React.FC = () => {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await loadClothingData();
      setClothingItems(data);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeRight = useCallback(async (cardIndex: number) => {
    const item = clothingItems[cardIndex];
    if (item) {
      await StorageService.saveLikedItem(item.id);
      console.log('Liked item:', item.id);
    }
  }, [clothingItems]);

  const handleSwipeLeft = useCallback(async (cardIndex: number) => {
    const item = clothingItems[cardIndex];
    if (item) {
      await StorageService.saveDislikedItem(item.id);
      console.log('Disliked item:', item.id);
    }
  }, [clothingItems]);

  const handleSwipedAll = useCallback(() => {
    Alert.alert(
      'Все вещи просмотрены!',
      'Вы просмотрели все доступные вещи. Перейдите в профиль, чтобы увидеть ваш стиль.',
      [{ text: 'OK' }]
    );
  }, []);

  const renderCard = useCallback((item: ClothingItem, index: number) => {
    return <ClothingCard key={item.id} item={item} />;
  }, []);

  const renderNoMoreCards = useCallback(() => {
    return (
      <View style={styles.noMoreCardsContainer}>
        <Text style={styles.noMoreCardsText}>Больше вещей нет</Text>
        <Text style={styles.noMoreCardsSubtext}>
          Перейдите в профиль, чтобы увидеть ваш стиль
        </Text>
      </View>
    );
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка вещей...</Text>
      </View>
    );
  }

  if (clothingItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет доступных вещей</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Выберите свой стиль</Text>
        <Text style={styles.headerSubtitle}>
          Свайпните вправо для лайка, влево для дизлайка
        </Text>
      </View>

      <View style={styles.swiperContainer}>
        <Swiper
          cards={clothingItems}
          renderCard={renderCard}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          onSwipedAll={handleSwipedAll}
          renderNoMoreCards={renderNoMoreCards}
          cardIndex={currentIndex}
          backgroundColor="transparent"
          stackSize={3}
          stackSeparation={15}
          animateOverlayLabelsOpacity
          animateCardOpacity
          swipeBackCard
          overlayLabels={{
            left: {
              title: 'НЕ',
              style: {
                label: {
                  backgroundColor: '#FF6B6B',
                  borderColor: '#FF6B6B',
                  color: 'white',
                  borderWidth: 1,
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
              title: 'ДА',
              style: {
                label: {
                  backgroundColor: '#4ECDC4',
                  borderColor: '#4ECDC4',
                  color: 'white',
                  borderWidth: 1,
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  swiperContainer: {
    flex: 1,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  noMoreCardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    padding: 40,
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  noMoreCardsSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});