import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StyleAnalysis } from '../types';
import { analyzeImageStyle, getStyleDescription } from '../utils/styleAnalysis';

export const MyItemScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<StyleAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Нет доступа к галерее',
        'Для выбора фотографии необходимо разрешение на доступ к галерее'
      );
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Нет доступа к камере',
        'Для съемки фотографии необходимо разрешение на доступ к камере'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Ошибка', 'Не удалось сделать фотографию');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeImageStyle(selectedImage);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Ошибка', 'Не удалось проанализировать изображение');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Выберите источник',
      'Откуда вы хотите загрузить фотографию?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Галерея', onPress: pickImageFromGallery },
        { text: 'Камера', onPress: takePhoto },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Моя вещь</Text>
        <Text style={styles.headerSubtitle}>
          Загрузите фото своей одежды для анализа стиля
        </Text>
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
            <TouchableOpacity style={styles.selectButton} onPress={showImagePicker}>
              <Text style={styles.selectButtonText}>Выбрать фото</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.changeButton} 
                onPress={showImagePicker}
              >
                <Text style={styles.changeButtonText}>Изменить фото</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]} 
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.analyzeButtonText}>Анализировать</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.analyzingText}>Анализируем ваш стиль...</Text>
          </View>
        )}

        {analysisResult && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Результаты анализа</Text>
            
            <View style={styles.styleResult}>
              <Text style={styles.styleLabel}>Основной стиль:</Text>
              <Text style={styles.styleValue}>{analysisResult.main_style}</Text>
              <Text style={styles.styleDescription}>
                {getStyleDescription(analysisResult.main_style)}
              </Text>
            </View>

            <View style={styles.styleResult}>
              <Text style={styles.styleLabel}>Дополнительный стиль:</Text>
              <Text style={styles.styleValue}>{analysisResult.secondary_style}</Text>
              <Text style={styles.styleDescription}>
                {getStyleDescription(analysisResult.secondary_style)}
              </Text>
            </View>

            <View style={styles.confidenceContainer}>
              <Text style={styles.confidenceLabel}>Уверенность:</Text>
              <Text style={styles.confidenceValue}>
                {Math.round(analysisResult.confidence! * 100)}%
              </Text>
            </View>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 48,
  },
  selectButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  changeButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analyzingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  styleResult: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  styleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  styleValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
  },
  styleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
});