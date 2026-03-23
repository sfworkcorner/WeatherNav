import {useCallback, useRef} from 'react';
import {useWeatherStore} from '../store/weatherStore';
import {
  getWeatherForUAECities,
  getWeatherGrid,
  getDetailedWeather,
} from '../services/weatherService';
import {MapBounds} from '../types';
import {WEATHER_FETCH_DEBOUNCE} from '../utils/constants';

export function useWeather() {
  const {
    weatherPoints,
    selectedWeather,
    selectedDailyForecast,
    activeFilter,
    isLoading,
    error,
    setWeatherPoints,
    setSelectedWeather,
    setSelectedDailyForecast,
    setActiveFilter,
    setIsLoading,
    setError,
  } = useWeatherStore();

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUAECitiesWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherForUAECities();
      setWeatherPoints(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [setWeatherPoints, setIsLoading, setError]);

  const fetchWeatherForBounds = useCallback(
    async (bounds: MapBounds, gridSize?: number) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getWeatherGrid(bounds, gridSize);
          setWeatherPoints(data);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to fetch weather data';
          setError(errorMessage);
          console.error('Weather grid fetch error:', err);
        } finally {
          setIsLoading(false);
        }
      }, WEATHER_FETCH_DEBOUNCE);
    },
    [setWeatherPoints, setIsLoading, setError],
  );

  const fetchDetailedWeather = useCallback(
    async (lat: number, lon: number) => {
      try {
        const data = await getDetailedWeather(lat, lon);
        setSelectedWeather(data.current);
        setSelectedDailyForecast(data.daily);
      } catch (err) {
        console.error('Detailed weather fetch error:', err);
      }
    },
    [setSelectedWeather, setSelectedDailyForecast],
  );

  const filteredWeatherPoints = weatherPoints.filter(point => {
    if (activeFilter === 'all') {
      return true;
    }
    return point.category === activeFilter;
  });

  return {
    weatherPoints: filteredWeatherPoints,
    allWeatherPoints: weatherPoints,
    selectedWeather,
    selectedDailyForecast,
    activeFilter,
    isLoading,
    error,
    fetchUAECitiesWeather,
    fetchWeatherForBounds,
    fetchDetailedWeather,
    setActiveFilter,
    setSelectedWeather,
  };
}
