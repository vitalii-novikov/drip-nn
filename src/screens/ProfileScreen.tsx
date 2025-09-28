import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  RefreshControl 
} from 'react-native';
import { StyleChart } from '../components/StyleChart';
import { ClothingItem, StyleDistribution } from '../types';
import { loadClothingData } from '../utils/csvParser';
import { StorageService } from '../utils/storage';
import { analyzeUserStyle, getStyleDescription } from '../utils/styleAnalysis';

export const ProfileScreen: React.FC = () => {
  const [likedItems, setLikedItems] = useState<ClothingItem[]>([]);
  const [dislikedItems, setDislikedItems] = useState<ClothingItem[]>([]);
  const [styleDistribution, setStyleDistribution] = useState<StyleDistribution[]>([]);
  const [showDisliked, setShowDisliked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allClothingData, setAllClothingData] = useState<ClothingItem[]>([]);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      // Загружаем все данные одежды
      const clothingData = await loadClothingData();
      setAllClothingData(clothingData);

      // Получаем предпочтения пользователя
      const preferences = await StorageService.getUserPreferences();
      
      // Фильтруем лайкнутые и дизлайкнутые вещи
      const liked = clothingData.filter(item => preferences.likedItems.includes(item.id));
      const disliked = clothingData.filter(item => preferences.dislikedItems.includes(item.id));
      
      setLikedItems(liked);
      setDislikedItems(disliked);
      
      // Анализируем стиль пользователя
      const distribution = analyzeUserStyle(liked);
      setStyleDistribution(distribution);
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные профиля');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  }, []);

  const clearAllData = () => {
    Alert.alert(
      'Очистить данные',
      'Вы уверены, что хотите удалить все лайки и дизлайки?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAllData();
            await loadProfileData();
          },
        },
      ]
    );
  };

  const renderClothingItem = (item: ClothingItem) => (
    <View key={item.id} style={styles.clothingItem}>
      <Image
        source={{ uri: item.link }}
        style={styles.clothingImage}
        resizeMode="cover"
      />
      <View style={styles.clothingInfo}>
        <Text style={styles.clothingTitle} numberOfLines={2}>
          {item.productDisplayName}
        </Text>
        <Text style={styles.clothingStyle}>{item.main_style}</Text>
      </View>
    </View>
  );

  const currentItems = showDisliked ? dislikedItems : likedItems;
  const itemsTitle = showDisliked ? 'Дизлайкнутые вещи' : 'Лайкнутые вещи';

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ваш стиль</Text>
        <Text style={styles.headerSubtitle}>
          Анализ на основе {likedItems.length} лайкнутых вещей
        </Text>
      </View>

      {styleDistribution.length > 0 && (
        <StyleChart data={styleDistribution} />
      )}

      {styleDistribution.length > 0 && (
        <View style={styles.styleDetailsContainer}>
          <Text style={styles.sectionTitle}>Детали стиля</Text>
          {styleDistribution.slice(0, 3).map((item, index) => (
            <View key={item.style} style={styles.styleDetailItem}>
              <View style={styles.styleDetailHeader}>
                <Text style={styles.styleDetailName}>{item.style}</Text>
                <Text style={styles.styleDetailPercentage}>{item.percentage}%</Text>
              </View>
              <Text style={styles.styleDetailDescription}>
                {getStyleDescription(item.style)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.itemsSection}>
        <View style={styles.itemsHeader}>
          <Text style={styles.sectionTitle}>{itemsTitle}</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setShowDisliked(!showDisliked)}
          >
            <Text style={styles.toggleButtonText}>
              {showDisliked ? 'Показать лайки' : 'Показать дизлайки'}
            </Text>
          </TouchableOpacity>
        </View>

        {currentItems.length > 0 ? (
          <View style={styles.itemsGrid}>
            {currentItems.map(renderClothingItem)}
          </View>
        ) : (
          <View style={styles.emptyItemsContainer}>
            <Text style={styles.emptyItemsText}>
              {showDisliked 
                ? 'У вас нет дизлайкнутых вещей' 
                : 'У вас нет лайкнутых вещей'
              }
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
        <Text style={styles.clearButtonText}>Очистить все данные</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  styleDetailsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  styleDetailItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  styleDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  styleDetailName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  styleDetailPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  styleDetailDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  itemsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  clothingItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    overflow: 'hidden',
  },
  clothingImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e9ecef',
  },
  clothingInfo: {
    padding: 8,
  },
  clothingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  clothingStyle: {
    fontSize: 10,
    color: '#4A90E2',
  },
  emptyItemsContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyItemsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});