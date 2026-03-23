import {create} from 'zustand';
import {
  WeatherData,
  WeatherFilter,
  Coordinates,
  DailyForecast,
} from '../types';

interface WeatherState {
  // Weather data
  weatherPoints: WeatherData[];
  selectedWeather: WeatherData | null;
  selectedDailyForecast: DailyForecast[];
  isLoading: boolean;
  error: string | null;

  // Filter
  activeFilter: WeatherFilter;

  // Navigation
  isNavigating: boolean;
  navigationDestination: Coordinates | null;

  // User location
  userLocation: Coordinates | null;

  // Actions
  setWeatherPoints: (points: WeatherData[]) => void;
  setSelectedWeather: (weather: WeatherData | null) => void;
  setSelectedDailyForecast: (forecast: DailyForecast[]) => void;
  setActiveFilter: (filter: WeatherFilter) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsNavigating: (navigating: boolean) => void;
  setNavigationDestination: (destination: Coordinates | null) => void;
  setUserLocation: (location: Coordinates | null) => void;
  startNavigation: (destination: Coordinates) => void;
  stopNavigation: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  // Initial state
  weatherPoints: [],
  selectedWeather: null,
  selectedDailyForecast: [],
  isLoading: false,
  error: null,
  activeFilter: 'all',
  isNavigating: false,
  navigationDestination: null,
  userLocation: null,

  // Actions
  setWeatherPoints: (points) => set({weatherPoints: points}),
  setSelectedWeather: (weather) => set({selectedWeather: weather}),
  setSelectedDailyForecast: (forecast) =>
    set({selectedDailyForecast: forecast}),
  setActiveFilter: (filter) => set({activeFilter: filter}),
  setIsLoading: (loading) => set({isLoading: loading}),
  setError: (error) => set({error}),
  setIsNavigating: (navigating) => set({isNavigating: navigating}),
  setNavigationDestination: (destination) =>
    set({navigationDestination: destination}),
  setUserLocation: (location) => set({userLocation: location}),
  startNavigation: (destination) =>
    set({isNavigating: true, navigationDestination: destination}),
  stopNavigation: () =>
    set({isNavigating: false, navigationDestination: null}),
}));
