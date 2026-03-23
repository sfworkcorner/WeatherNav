import {useEffect, useCallback} from 'react';
import {Platform, PermissionsAndroid, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useWeatherStore} from '../store/weatherStore';

export function useLocation() {
  const setUserLocation = useWeatherStore(state => state.setUserLocation);
  const userLocation = useWeatherStore(state => state.userLocation);

  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'WeatherNav Location Permission',
            message:
              'WeatherNav needs access to your location to show weather and provide navigation.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    return true;
  }, []);

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'Please enable location permission in your device settings to use WeatherNav.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Geolocation error:', error);
        // Default to Dubai if location fails
        setUserLocation({
          latitude: 25.2048,
          longitude: 55.2708,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, [requestLocationPermission, setUserLocation]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {userLocation, getCurrentLocation};
}
