import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class WeatherCacheModel extends Model {
  static table = 'weather_cache';

  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @field('temperature') temperature!: number;
  @field('weather_code') weatherCode!: number;
  @field('precipitation') precipitation!: number;
  @field('rain') rain!: number;
  @field('wind_speed') windSpeed!: number;
  @field('humidity') humidity!: number;
  @field('description') description!: string;
  @field('icon') icon!: string;
  @field('category') category!: string;
  @field('fetched_at') fetchedAt!: number;
}
