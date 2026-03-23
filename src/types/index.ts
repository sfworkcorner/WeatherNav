export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  weatherCode: number;
  precipitation: number;
  rain: number;
  windSpeed: number;
  humidity: number;
  apparentTemperature: number;
  cloudCover: number;
  isRaining: boolean;
  description: string;
  icon: string;
  category: WeatherCategory;
}

export type WeatherCategory =
  | 'sunny'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'storm'
  | 'unknown';

export type WeatherFilter = 'all' | WeatherCategory;

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationSum: number;
  rainSum: number;
  description: string;
  icon: string;
}

export interface WeatherResponse {
  current: WeatherData;
  daily: DailyForecast[];
}

export interface GeoJSONFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    temperature: number;
    description: string;
    icon: string;
    category: WeatherCategory;
    precipitation: number;
    windSpeed: number;
    humidity: number;
    apparentTemperature: number;
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
