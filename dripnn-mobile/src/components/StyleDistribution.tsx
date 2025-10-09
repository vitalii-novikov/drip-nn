import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface StyleData {
  style: string;
  count: number;
  percentage: number;
}

interface StyleDistributionProps {
  data: StyleData[];
}

export const StyleDistribution: React.FC<StyleDistributionProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No style data available</Text>
        <Text style={styles.emptySubtext}>Start liking items to see your style preferences</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Style Preferences</Text>
      <ScrollView style={styles.scrollView}>
        {data.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.styleName}>{item.style}</Text>
              <Text style={styles.percentage}>{item.percentage.toFixed(1)}%</Text>
            </View>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  { width: `${item.percentage}%` },
                  { backgroundColor: getBarColor(index) },
                ]}
              />
            </View>
            <Text style={styles.count}>{item.count} items</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const getBarColor = (index: number): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  item: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  styleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  count: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});