import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { ClothingItem } from '../types';

const { width, height } = Dimensions.get('window');

interface ClothingCardProps {
  item: ClothingItem;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.link }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={require('../../assets/placeholder.png')}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.productDisplayName}
        </Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Тип:</Text>
            <Text style={styles.detailValue}>{item.articleType}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Цвет:</Text>
            <Text style={styles.detailValue}>{item.baseColour}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Сезон:</Text>
            <Text style={styles.detailValue}>{item.season}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Стиль:</Text>
            <Text style={styles.detailValue}>{item.usage}</Text>
          </View>
        </View>
        
        <View style={styles.styleContainer}>
          <Text style={styles.styleLabel}>Основной стиль:</Text>
          <Text style={styles.styleValue}>{item.main_style}</Text>
        </View>
        
        <View style={styles.styleContainer}>
          <Text style={styles.styleLabel}>Дополнительный стиль:</Text>
          <Text style={styles.styleValue}>{item.secondary_style}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 0.6,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 0.4,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  styleContainer: {
    marginBottom: 8,
  },
  styleLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  styleValue: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
});