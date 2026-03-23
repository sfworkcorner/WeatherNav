import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {WeatherFilter} from '../types';

interface FilterOption {
  key: WeatherFilter;
  label: string;
  emoji: string;
}

const FILTERS: FilterOption[] = [
  {key: 'all', label: 'All', emoji: '\uD83C\uDF0D'},
  {key: 'rain', label: 'Rain', emoji: '\uD83C\uDF27\uFE0F'},
  {key: 'sunny', label: 'Sunny', emoji: '\u2600\uFE0F'},
  {key: 'cloudy', label: 'Cloudy', emoji: '\u2601\uFE0F'},
  {key: 'storm', label: 'Storm', emoji: '\u26C8\uFE0F'},
  {key: 'fog', label: 'Fog', emoji: '\uD83C\uDF2B\uFE0F'},
  {key: 'snow', label: 'Snow', emoji: '\u2744\uFE0F'},
];

interface Props {
  activeFilter: WeatherFilter;
  onFilterChange: (filter: WeatherFilter) => void;
}

export function WeatherFilterBar({activeFilter, onFilterChange}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {FILTERS.map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              activeFilter === filter.key && styles.activeFilter,
            ]}
            onPress={() => onFilterChange(filter.key)}
            activeOpacity={0.7}>
            <Text style={styles.emoji}>{filter.emoji}</Text>
            <Text
              style={[
                styles.label,
                activeFilter === filter.key && styles.activeLabel,
              ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    marginHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  activeLabel: {
    color: 'white',
  },
});
