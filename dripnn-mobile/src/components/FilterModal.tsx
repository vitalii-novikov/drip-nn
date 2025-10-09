import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { FilterOptions } from '../types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onFiltersChange,
}) => {
  const categoryOptions = ['Topwear', 'Bottomwear', 'Footwear', 'Accessories'];
  const seasonOptions = ['Fall', 'Summer', 'Winter', 'Spring'];
  const basecolourOptions = ['White', 'Black', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Grey'];
  const typeOptions = ['Shirts', 'T-shirts', 'Jeans', 'Trousers', 'Dresses', 'Skirts', 'Jackets', 'Sweaters', 'Shoes', 'Bags'];
  const styleOptions = ['Formal', 'Casual', 'Business Casual', 'Streetwear', 'Vintage', 'Bohemian', 'Minimalist', 'Sporty'];

  const handleFilterChange = (type: keyof FilterOptions, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [type]: value as any,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.category && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('category', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.category && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.category === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('category', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.category === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Season Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Season</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.season && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('season', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.season && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {seasonOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.season === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('season', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.season === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Base Colour Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.basecolour && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('basecolour', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.basecolour && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {basecolourOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.basecolour === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('basecolour', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.basecolour === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Type Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.type && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('type', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.type && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.type === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('type', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.type === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Style Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Style</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.style1 && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('style1', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.style1 && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {styleOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.style1 === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('style1', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.style1 === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  clearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearText: {
    color: '#666',
    fontSize: 16,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  applyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});