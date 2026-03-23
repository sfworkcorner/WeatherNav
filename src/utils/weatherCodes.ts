import {WeatherCategory} from '../types';

interface WeatherCodeInfo {
  description: string;
  icon: string;
  category: WeatherCategory;
}

export const WMO_CODES: Record<number, WeatherCodeInfo> = {
  0: {description: 'Clear sky', icon: '\u2600\uFE0F', category: 'sunny'},
  1: {description: 'Mainly clear', icon: '\uD83C\uDF24\uFE0F', category: 'sunny'},
  2: {description: 'Partly cloudy', icon: '\u26C5', category: 'cloudy'},
  3: {description: 'Overcast', icon: '\u2601\uFE0F', category: 'cloudy'},
  45: {description: 'Fog', icon: '\uD83C\uDF2B\uFE0F', category: 'fog'},
  48: {description: 'Depositing rime fog', icon: '\uD83C\uDF2B\uFE0F', category: 'fog'},
  51: {description: 'Light drizzle', icon: '\uD83C\uDF26\uFE0F', category: 'rain'},
  53: {description: 'Moderate drizzle', icon: '\uD83C\uDF26\uFE0F', category: 'rain'},
  55: {description: 'Dense drizzle', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  56: {description: 'Light freezing drizzle', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  57: {description: 'Dense freezing drizzle', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  61: {description: 'Slight rain', icon: '\uD83C\uDF26\uFE0F', category: 'rain'},
  63: {description: 'Moderate rain', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  65: {description: 'Heavy rain', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  66: {description: 'Light freezing rain', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  67: {description: 'Heavy freezing rain', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  71: {description: 'Slight snowfall', icon: '\uD83C\uDF28\uFE0F', category: 'snow'},
  73: {description: 'Moderate snowfall', icon: '\uD83C\uDF28\uFE0F', category: 'snow'},
  75: {description: 'Heavy snowfall', icon: '\u2744\uFE0F', category: 'snow'},
  77: {description: 'Snow grains', icon: '\u2744\uFE0F', category: 'snow'},
  80: {description: 'Slight rain showers', icon: '\uD83C\uDF26\uFE0F', category: 'rain'},
  81: {description: 'Moderate rain showers', icon: '\uD83C\uDF27\uFE0F', category: 'rain'},
  82: {description: 'Violent rain showers', icon: '\u26C8\uFE0F', category: 'rain'},
  85: {description: 'Slight snow showers', icon: '\uD83C\uDF28\uFE0F', category: 'snow'},
  86: {description: 'Heavy snow showers', icon: '\uD83C\uDF28\uFE0F', category: 'snow'},
  95: {description: 'Thunderstorm', icon: '\u26C8\uFE0F', category: 'storm'},
  96: {
    description: 'Thunderstorm w/ slight hail',
    icon: '\u26C8\uFE0F',
    category: 'storm',
  },
  99: {
    description: 'Thunderstorm w/ heavy hail',
    icon: '\u26C8\uFE0F',
    category: 'storm',
  },
};

export function getWeatherDescription(code: number): string {
  return WMO_CODES[code]?.description ?? 'Unknown';
}

export function getWeatherIcon(code: number): string {
  return WMO_CODES[code]?.icon ?? '\u2753';
}

export function getWeatherCategory(code: number): WeatherCategory {
  return WMO_CODES[code]?.category ?? 'unknown';
}
