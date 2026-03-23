import React, {useEffect, useCallback, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Mapbox, {
  MapView,
  Camera,
  LocationPuck,
  ShapeSource,
  SymbolLayer,
} from '@rnmapbox/maps';
import type {Feature, Point} from 'geojson';
import BottomSheet from '@gorhom/bottom-sheet';
import {WeatherFilterBar} from '../components/WeatherFilterBar';
import {WeatherBottomSheet} from '../components/WeatherBottomSheet';
import {LoadingOverlay} from '../components/LoadingOverlay';
import {ErrorBanner} from '../components/ErrorBanner';
import {useWeather} from '../hooks/useWeather';
import {useLocation} from '../hooks/useLocation';
import {useWeatherStore} from '../store/weatherStore';
import {MAPBOX_ACCESS_TOKEN, UAE_CENTER, DEFAULT_ZOOM} from '../utils/constants';
import {GeoJSONFeatureCollection} from '../types';
import {UAE_CITIES} from '../utils/constants';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

interface MapScreenProps {
  onStartNavigation: (destination: {latitude: number; longitude: number}) => void;
}

export default function MapScreen({onStartNavigation}: MapScreenProps) {
  const {
    weatherPoints,
    selectedWeather,
    selectedDailyForecast,
    activeFilter,
    isLoading,
    error,
    fetchUAECitiesWeather,
    fetchDetailedWeather,
    setActiveFilter,
    setSelectedWeather,
  } = useWeather();

  useLocation();
  const userLocation = useWeatherStore(state => state.userLocation);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedLocationName, setSelectedLocationName] = useState('');

  // Fetch weather on mount
  useEffect(() => {
    fetchUAECitiesWeather();
  }, [fetchUAECitiesWeather]);

  // Convert weather points to GeoJSON
  const geojson: GeoJSONFeatureCollection = {
    type: 'FeatureCollection',
    features: weatherPoints.map((point, index) => ({
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude],
      },
      properties: {
        temperature: point.temperature,
        description: point.description,
        icon: point.icon,
        category: point.category,
        precipitation: point.precipitation,
        windSpeed: point.windSpeed,
        humidity: point.humidity,
        apparentTemperature: point.apparentTemperature,
      },
    })),
  };

  // Handle marker press
  const handleMarkerPress = useCallback(
    async (event: {features: Feature[]; coordinates: {latitude: number; longitude: number}; point: {x: number; y: number}}) => {
      const feature = event.features[0];
      if (!feature || !feature.geometry || feature.geometry.type !== 'Point') {
        return;
      }

      const pointGeom = feature.geometry as Point;
      const [lon, lat] = pointGeom.coordinates;

      // Find city name if it matches a known UAE city
      const matchingCity = UAE_CITIES.find(
        city =>
          Math.abs(city.latitude - lat) < 0.05 &&
          Math.abs(city.longitude - lon) < 0.05,
      );
      setSelectedLocationName(
        matchingCity?.name ?? `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      );

      // Fetch detailed weather for this location
      await fetchDetailedWeather(lat, lon);

      // Open bottom sheet
      bottomSheetRef.current?.snapToIndex(0);
    },
    [fetchDetailedWeather],
  );

  const handleNavigatePress = useCallback(() => {
    if (selectedWeather) {
      bottomSheetRef.current?.close();
      onStartNavigation({
        latitude: selectedWeather.latitude,
        longitude: selectedWeather.longitude,
      });
    }
  }, [selectedWeather, onStartNavigation]);

  const handleBottomSheetClose = useCallback(() => {
    setSelectedWeather(null);
  }, [setSelectedWeather]);

  const initialCenter: [number, number] = userLocation
    ? [userLocation.longitude, userLocation.latitude]
    : [UAE_CENTER.longitude, UAE_CENTER.latitude];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled
        scaleBarEnabled={false}>
        <Camera
          defaultSettings={{
            centerCoordinate: initialCenter,
            zoomLevel: DEFAULT_ZOOM,
          }}
        />

        <LocationPuck puckBearingEnabled puckBearing="heading" visible />

        {/* Weather markers */}
        <ShapeSource
          id="weatherPoints"
          shape={geojson}
          onPress={handleMarkerPress}>
          <SymbolLayer
            id="weatherSymbols"
            style={{
              textField: [
                'concat',
                ['get', 'icon'],
                '\n',
                ['to-string', ['round', ['get', 'temperature']]],
                '\u00B0',
              ],
              textSize: 14,
              textAllowOverlap: true,
              textIgnorePlacement: false,
              textPadding: 4,
              textAnchor: 'center',
              textOffset: [0, 0],
            }}
          />
        </ShapeSource>
      </MapView>

      {/* Filter bar */}
      <WeatherFilterBar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {/* Loading indicator */}
      <LoadingOverlay visible={isLoading} message="Loading weather..." />

      {/* Error banner */}
      <ErrorBanner message={error} onRetry={fetchUAECitiesWeather} />

      {/* Weather detail bottom sheet */}
      {selectedWeather && (
        <WeatherBottomSheet
          ref={bottomSheetRef}
          weather={selectedWeather}
          dailyForecast={selectedDailyForecast}
          locationName={selectedLocationName}
          onNavigatePress={handleNavigatePress}
          onClose={handleBottomSheetClose}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
