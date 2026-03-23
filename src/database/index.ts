import {Database} from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {schema} from './schema';
import FavoriteLocation from './models/FavoriteLocation';
import WeatherCacheModel from './models/WeatherCache';
import RecentNavigation from './models/RecentNavigation';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [FavoriteLocation, WeatherCacheModel, RecentNavigation],
});

export {FavoriteLocation, WeatherCacheModel, RecentNavigation};
