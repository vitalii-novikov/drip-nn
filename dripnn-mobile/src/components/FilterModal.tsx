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
  const genderOptions: Array<'Male' | 'Female'> = ['Male', 'Female'];
  const categoryOptions: Array<'Topwear' | 'Bottomwear'> = ['Topwear', 'Bottomwear'];
  const seasonOptions: Array<'Fall' | 'Summer' | 'Winter' | 'Spring'> = [
    'Fall',
    'Summer',
    'Winter',
    'Spring',
  ];

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
            {/* Gender Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.option,
                    !filters.gender && styles.optionSelected,
                  ]}
                  onPress={() => handleFilterChange('gender', undefined)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      !filters.gender && styles.optionTextSelected,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.option,
                      filters.gender === option && styles.optionSelected,
                    ]}
                    onPress={() => handleFilterChange('gender', option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.gender === option && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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