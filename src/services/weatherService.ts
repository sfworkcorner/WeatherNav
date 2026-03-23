import axios from 'axios';
import {
  WeatherData,
  DailyForecast,
  MapBounds,
  WeatherCategory,
} from '../types';
import {
  getWeatherDescription,
  getWeatherIcon,
  getWeatherCategory,
} from '../utils/weatherCodes';
import {OPEN_METEO_BASE_URL, UAE_CITIES} from '../utils/constants';
import {clampToUAE} from '../utils/helpers';

interface WeatherCache {
  data: WeatherData[];
  timestamp: number;
  boundsKey: string;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let weatherCache: WeatherCache | null = null;

function getBoundsKey(bounds: MapBounds): string {
  return `${bounds.north.toFixed(2)}_${bounds.south.toFixed(2)}_${bounds.east.toFixed(2)}_${bounds.west.toFixed(2)}`;
}

/**
 * Fetch weather for a single coordinate
 */
export async function getWeatherForLocation(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const response = await axios.get(OPEN_METEO_BASE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'weather_code',
        'precipitation',
        'rain',
        'wind_speed_10m',
        'relative_humidity_2m',
        'apparent_temperature',
        'cloud_cover',
      ].join(','),
      timezone: 'Asia/Dubai',
    },
  });

  const current = response.data.current;
  const weatherCode: number = current.weather_code;
  const category: WeatherCategory = getWeatherCategory(weatherCode);

  return {
    latitude: lat,
    longitude: lon,
    temperature: current.temperature_2m,
    weatherCode,
    precipitation: current.precipitation,
    rain: current.rain,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    apparentTemperature: current.apparent_temperature,
    cloudCover: current.cloud_cover,
    isRaining: current.rain > 0 || current.precipitation > 0,
    description: getWeatherDescription(weatherCode),
    icon: getWeatherIcon(weatherCode),
    category,
  };
}

/**
 * Fetch detailed weather with daily forecast for a location
 */
export async function getDetailedWeather(
  lat: number,
  lon: number,
): Promise<{current: WeatherData; daily: DailyForecast[]}> {
  const response = await axios.get(OPEN_METEO_BASE_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'weather_code',
        'precipitation',
        'rain',
        'wind_speed_10m',
        'relative_humidity_2m',
        'apparent_temperature',
        'cloud_cover',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'rain_sum',
      ].join(','),
      timezone: 'Asia/Dubai',
      forecast_days: 7,
    },
  });

  const current = response.data.current;
  const weatherCode: number = current.weather_code;
  const category: WeatherCategory = getWeatherCategory(weatherCode);

  const weatherData: WeatherData = {
    latitude: lat,
    longitude: lon,
    temperature: current.temperature_2m,
    weatherCode,
    precipitation: current.precipitation,
    rain: current.rain,
    windSpeed: current.wind_speed_10m,
    humidity: current.relative_humidity_2m,
    apparentTemperature: current.apparent_temperature,
    cloudCover: current.cloud_cover,
    isRaining: current.rain > 0 || current.precipitation > 0,
    description: getWeatherDescription(weatherCode),
    icon: getWeatherIcon(weatherCode),
    category,
  };

  const dailyData = response.data.daily;
  const dailyForecasts: DailyForecast[] = dailyData.time.map(
    (date: string, index: number) => {
      const dayCode: number = dailyData.weather_code[index];
      return {
        date,
        weatherCode: dayCode,
        temperatureMax: dailyData.temperature_2m_max[index],
        temperatureMin: dailyData.temperature_2m_min[index],
        precipitationSum: dailyData.precipitation_sum[index],
        rainSum: dailyData.rain_sum[index],
        description: getWeatherDescription(dayCode),
        icon: getWeatherIcon(dayCode),
      };
    },
  );

  return {current: weatherData, daily: dailyForecasts};
}

/**
 * Fetch weather for UAE cities (primary method)
 */
export async function getWeatherForUAECities(): Promise<WeatherData[]> {
  // Check cache
  if (weatherCache && Date.now() - weatherCache.timestamp < CACHE_DURATION) {
    return weatherCache.data;
  }

  // Open-Meteo supports batch requests with comma-separated coordinates
  const latitudes = UAE_CITIES.map(c => c.latitude).join(',');
  const longitudes = UAE_CITIES.map(c => c.longitude).join(',');

  const response = await axios.get(OPEN_METEO_BASE_URL, {
    params: {
      latitude: latitudes,
      longitude: longitudes,
      current: [
        'temperature_2m',
        'weather_code',
        'precipitation',
        'rain',
        'wind_speed_10m',
        'relative_humidity_2m',
        'apparent_temperature',
        'cloud_cover',
      ].join(','),
      timezone: 'Asia/Dubai',
    },
  });

  // When multiple locations are requested, response is an array
  const results = Array.isArray(response.data)
    ? response.data
    : [response.data];

  const weatherDataList: WeatherData[] = results.map(
    (result: Record<string, unknown>, index: number) => {
      const current = result.current as Record<string, number>;
      const weatherCode: number = current.weather_code;
      const city = UAE_CITIES[index];
      const category: WeatherCategory = getWeatherCategory(weatherCode);

      return {
        latitude: city.latitude,
        longitude: city.longitude,
        temperature: current.temperature_2m,
        weatherCode,
        precipitation: current.precipitation,
        rain: current.rain,
        windSpeed: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
        apparentTemperature: current.apparent_temperature,
        cloudCover: current.cloud_cover,
        isRaining: current.rain > 0 || current.precipitation > 0,
        description: getWeatherDescription(weatherCode),
        icon: getWeatherIcon(weatherCode),
        category,
      };
    },
  );

  // Update cache
  weatherCache = {
    data: weatherDataList,
    timestamp: Date.now(),
    boundsKey: 'uae_cities',
  };

  return weatherDataList;
}

/**
 * Fetch weather for a grid of points within map bounds (for zoomed-in views)
 */
export async function getWeatherGrid(
  bounds: MapBounds,
  gridSize: number = 4,
): Promise<WeatherData[]> {
  const clampedBounds = clampToUAE(bounds);
  const boundsKey = getBoundsKey(clampedBounds);

  // Check cache
  if (
    weatherCache &&
    weatherCache.boundsKey === boundsKey &&
    Date.now() - weatherCache.timestamp < CACHE_DURATION
  ) {
    return weatherCache.data;
  }

  const latStep = (clampedBounds.north - clampedBounds.south) / gridSize;
  const lonStep = (clampedBounds.east - clampedBounds.west) / gridSize;

  const latitudes: number[] = [];
  const longitudes: number[] = [];

  for (let i = 0; i <= gridSize; i++) {
    for (let j = 0; j <= gridSize; j++) {
      latitudes.push(
        Number((clampedBounds.south + i * latStep).toFixed(4)),
      );
      longitudes.push(
        Number((clampedBounds.west + j * lonStep).toFixed(4)),
      );
    }
  }

  const response = await axios.get(OPEN_METEO_BASE_URL, {
    params: {
      latitude: latitudes.join(','),
      longitude: longitudes.join(','),
      current: [
        'temperature_2m',
        'weather_code',
        'precipitation',
        'rain',
        'wind_speed_10m',
        'relative_humidity_2m',
        'apparent_temperature',
        'cloud_cover',
      ].join(','),
      timezone: 'Asia/Dubai',
    },
  });

  const results = Array.isArray(response.data)
    ? response.data
    : [response.data];

  const weatherDataList: WeatherData[] = results.map(
    (result: Record<string, unknown>, index: number) => {
      const current = result.current as Record<string, number>;
      const weatherCode: number = current.weather_code;
      const category: WeatherCategory = getWeatherCategory(weatherCode);

      return {
        latitude: latitudes[index],
        longitude: longitudes[index],
        temperature: current.temperature_2m,
        weatherCode,
        precipitation: current.precipitation,
        rain: current.rain,
        windSpeed: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
        apparentTemperature: current.apparent_temperature,
        cloudCover: current.cloud_cover,
        isRaining: current.rain > 0 || current.precipitation > 0,
        description: getWeatherDescription(weatherCode),
        icon: getWeatherIcon(weatherCode),
        category,
      };
    },
  );

  // Update cache
  weatherCache = {
    data: weatherDataList,
    timestamp: Date.now(),
    boundsKey,
  };

  return weatherDataList;
}
