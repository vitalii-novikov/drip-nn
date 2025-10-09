import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FilterOptions } from '../types';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onOpenModal: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onOpenModal,
}) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  const removeFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const getFilterDisplayName = (key: keyof FilterOptions, value: string) => {
    const displayNames: { [key in keyof FilterOptions]: string } = {
      category: 'Category',
      season: 'Season',
      basecolour: 'Color',
      type: 'Type',
      style1: 'Style',
      style2: 'Style 2',
    };
    return `${displayNames[key]}: ${value}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hasActiveFilters ? (
          <>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.activeFilter}
                  onPress={() => removeFilter(key as keyof FilterOptions)}
                >
                  <Text style={styles.activeFilterText}>
                    {getFilterDisplayName(key as keyof FilterOptions, value)}
                  </Text>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={styles.clearAllButton}
              onPress={() => onFiltersChange({})}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noFiltersText}>No filters applied</Text>
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.filterButton} onPress={onOpenModal}>
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearAllButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  clearAllText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noFiltersText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});