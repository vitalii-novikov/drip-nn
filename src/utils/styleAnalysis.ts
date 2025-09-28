import { ClothingItem, StyleDistribution } from '../types';

// Возможные стили одежды
export const CLOTHING_STYLES = [
  "casual fashion",
  "sportswear", 
  "ethnic style",
  "formal wear",
  "smart casual",
  "party outfit",
  "travel outfit",
  "home wear"
];

// Функция для анализа стиля пользователя на основе лайкнутых вещей
export function analyzeUserStyle(likedItems: ClothingItem[]): StyleDistribution[] {
  const styleCounts: { [key: string]: number } = {};
  
  // Подсчитываем количество каждого стиля
  likedItems.forEach(item => {
    // Учитываем основной стиль
    if (item.main_style) {
      styleCounts[item.main_style] = (styleCounts[item.main_style] || 0) + 1;
    }
    
    // Учитываем дополнительный стиль (с меньшим весом)
    if (item.secondary_style) {
      styleCounts[item.secondary_style] = (styleCounts[item.secondary_style] || 0) + 0.5;
    }
  });
  
  const totalItems = likedItems.length;
  
  // Преобразуем в массив с процентами
  const distributions: StyleDistribution[] = Object.entries(styleCounts)
    .map(([style, count]) => ({
      style,
      count: Math.round(count),
      percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
  
  return distributions;
}

// Функция для определения стиля загруженного изображения (заглушка)
// В реальном приложении здесь будет интеграция с CLIP моделью
export async function analyzeImageStyle(imageUri: string): Promise<{
  main_style: string;
  secondary_style: string;
  confidence: number;
}> {
  // Имитация обработки изображения
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Возвращаем случайные стили для демонстрации
  const randomStyles = [...CLOTHING_STYLES].sort(() => Math.random() - 0.5);
  
  return {
    main_style: randomStyles[0],
    secondary_style: randomStyles[1],
    confidence: Math.random() * 0.3 + 0.7, // 70-100% уверенности
  };
}

// Функция для получения описания стиля
export function getStyleDescription(style: string): string {
  const descriptions: { [key: string]: string } = {
    "casual fashion": "Повседневная мода - комфортная и стильная одежда для ежедневного ношения",
    "sportswear": "Спортивная одежда - функциональная одежда для активного образа жизни",
    "ethnic style": "Этнический стиль - одежда с элементами традиционных культур",
    "formal wear": "Деловая одежда - элегантная одежда для официальных мероприятий",
    "smart casual": "Умный кэжуал - сочетание делового и повседневного стилей",
    "party outfit": "Праздничная одежда - яркая и эффектная одежда для вечеринок",
    "travel outfit": "Дорожная одежда - удобная одежда для путешествий",
    "home wear": "Домашняя одежда - комфортная одежда для дома",
  };
  
  return descriptions[style] || "Неизвестный стиль";
}