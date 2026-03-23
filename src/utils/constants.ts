// Open-Meteo API (free, no key required)
export const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// UAE bounding box
export const UAE_BOUNDS = {
  north: 26.5,
  south: 22.5,
  east: 56.5,
  west: 51.0,
};

// UAE center (approximately Abu Dhabi / Dubai area)
export const UAE_CENTER = {
  latitude: 24.4539,
  longitude: 54.3773,
};

// Dubai coordinates
export const DUBAI_CENTER = {
  latitude: 25.2048,
  longitude: 55.2708,
};

// Default zoom levels
export const DEFAULT_ZOOM = 7;
export const CITY_ZOOM = 10;
export const DETAIL_ZOOM = 13;

// Weather grid settings
export const GRID_SIZE_ZOOMED_OUT = 4; // 4x4 grid at country level
export const GRID_SIZE_ZOOMED_IN = 6; // 6x6 grid at city level

// Debounce delay for weather fetching (ms)
export const WEATHER_FETCH_DEBOUNCE = 800;

// Weather cache duration (ms) - 10 minutes
export const WEATHER_CACHE_DURATION = 10 * 60 * 1000;

// Mapbox access token placeholder
export const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_PUBLIC_TOKEN_HERE';

// Major UAE cities for initial weather points
export const UAE_CITIES = [
  {name: 'Dubai', latitude: 25.2048, longitude: 55.2708},
  {name: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773},
  {name: 'Sharjah', latitude: 25.3463, longitude: 55.4209},
  {name: 'Ajman', latitude: 25.4052, longitude: 55.5136},
  {name: 'Ras Al Khaimah', latitude: 25.7895, longitude: 55.9432},
  {name: 'Fujairah', latitude: 25.1288, longitude: 56.3265},
  {name: 'Umm Al Quwain', latitude: 25.5647, longitude: 55.5554},
  {name: 'Al Ain', latitude: 24.1912, longitude: 55.7606},
  {name: 'Khor Fakkan', latitude: 25.3393, longitude: 56.3498},
  {name: 'Kalba', latitude: 25.0657, longitude: 56.3572},
  {name: 'Dibba Al-Fujairah', latitude: 25.5942, longitude: 56.2628},
  {name: 'Madinat Zayed', latitude: 23.6531, longitude: 53.7033},
  {name: 'Ruwais', latitude: 24.1114, longitude: 52.7301},
  {name: 'Liwa Oasis', latitude: 23.1333, longitude: 53.6167},
  {name: 'Hatta', latitude: 24.7939, longitude: 56.1148},
  {name: 'Jebel Jais', latitude: 25.9550, longitude: 56.0898},
];
