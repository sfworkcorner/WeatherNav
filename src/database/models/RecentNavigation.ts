import {Model} from '@nozbe/watermelondb';
import {field} from '@nozbe/watermelondb/decorators';

export default class RecentNavigation extends Model {
  static table = 'recent_navigations';

  @field('destination_name') destinationName!: string;
  @field('destination_lat') destinationLat!: number;
  @field('destination_lon') destinationLon!: number;
  @field('weather_at_destination') weatherAtDestination!: string;
  @field('navigated_at') navigatedAt!: number;
}
