import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { StyleDistribution } from '../types';

const { width } = Dimensions.get('window');

interface StyleChartProps {
  data: StyleDistribution[];
}

export const StyleChart: React.FC<StyleChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет данных для отображения</Text>
      </View>
    );
  }

  // Подготавливаем данные для PieChart
  const chartData = data.map((item, index) => ({
    name: item.style,
    population: item.percentage,
    color: getColorForIndex(index),
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Распределение стилей</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          absolute
        />
      </View>
      
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={item.style} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: getColorForIndex(index) }
              ]} 
            />
            <Text style={styles.legendText}>
              {item.style}: {item.percentage}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Функция для получения цвета по индексу
function getColorForIndex(index: number): string {
  const colors = [
    '#FF6B6B', // Красный
    '#4ECDC4', // Бирюзовый
    '#45B7D1', // Синий
    '#96CEB4', // Зеленый
    '#FFEAA7', // Желтый
    '#DDA0DD', // Фиолетовый
    '#98D8C8', // Мятный
    '#F7DC6F', // Золотой
  ];
  return colors[index % colors.length];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    margin: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});