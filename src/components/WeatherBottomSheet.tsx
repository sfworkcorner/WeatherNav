import React, {useCallback, useMemo, forwardRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {WeatherData, DailyForecast} from '../types';
import {formatTemperature, formatWindSpeed, formatHumidity} from '../utils/helpers';

interface Props {
  weather: WeatherData | null;
  dailyForecast: DailyForecast[];
  locationName: string;
  onNavigatePress: () => void;
  onClose: () => void;
}

function DailyForecastItem({item}: {item: DailyForecast}) {
  const dayName = new Date(item.date).toLocaleDateString('en-US', {
    weekday: 'short',
  });

  return (
    <View style={styles.forecastItem}>
      <Text style={styles.forecastDay}>{dayName}</Text>
      <Text style={styles.forecastIcon}>{item.icon}</Text>
      <Text style={styles.forecastTemp}>
        {formatTemperature(item.temperatureMax)} /{' '}
        {formatTemperature(item.temperatureMin)}
      </Text>
      {item.precipitationSum > 0 && (
        <Text style={styles.forecastRain}>
          {item.precipitationSum.toFixed(1)}mm
        </Text>
      )}
    </View>
  );
}

export const WeatherBottomSheet = forwardRef<BottomSheet, Props>(
  ({weather, dailyForecast, locationName, onNavigatePress, onClose}, ref) => {
    const snapPoints = useMemo(() => ['35%', '65%'], []);

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose();
        }
      },
      [onClose],
    );

    if (!weather) {
      return null;
    }

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}>
        <BottomSheetView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.locationName}>{locationName}</Text>
              <Text style={styles.weatherDescription}>
                {weather.icon} {weather.description}
              </Text>
            </View>
            <Text style={styles.temperature}>
              {formatTemperature(weather.temperature)}
            </Text>
          </View>

          {/* Weather Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Feels Like</Text>
              <Text style={styles.detailValue}>
                {formatTemperature(weather.apparentTemperature)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>
                {formatWindSpeed(weather.windSpeed)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>
                {formatHumidity(weather.humidity)}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Rain</Text>
              <Text style={styles.detailValue}>
                {weather.rain.toFixed(1)} mm
              </Text>
            </View>
          </View>

          {/* Navigate Button */}
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={onNavigatePress}
            activeOpacity={0.8}>
            <Text style={styles.navigateButtonText}>
              Navigate Here
            </Text>
          </TouchableOpacity>

          {/* Daily Forecast */}
          {dailyForecast.length > 0 && (
            <View style={styles.forecastSection}>
              <Text style={styles.forecastTitle}>7-Day Forecast</Text>
              <FlatList
                data={dailyForecast}
                renderItem={({item}) => <DailyForecastItem item={item} />}
                keyExtractor={item => item.date}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.forecastList}
              />
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

WeatherBottomSheet.displayName = 'WeatherBottomSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  locationName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 16,
    color: '#666666',
  },
  temperature: {
    fontSize: 42,
    fontWeight: '200',
    color: '#1A1A1A',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    backgroundColor: '#F5F7FA',
    borderRadius: 16,
    padding: 12,
  },
  detailItem: {
    width: '50%',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  navigateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  forecastSection: {
    marginTop: 4,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  forecastList: {
    paddingRight: 20,
  },
  forecastItem: {
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    minWidth: 80,
  },
  forecastDay: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 4,
  },
  forecastIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 11,
    color: '#333333',
    fontWeight: '500',
  },
  forecastRain: {
    fontSize: 10,
    color: '#007AFF',
    marginTop: 2,
  },
});
