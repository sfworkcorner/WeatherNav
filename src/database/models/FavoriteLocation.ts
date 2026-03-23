import {Model} from '@nozbe/watermelondb';
import {field, date} from '@nozbe/watermelondb/decorators';

export default class FavoriteLocation extends Model {
  static table = 'favorite_locations';

  @field('name') name!: string;
  @field('latitude') latitude!: number;
  @field('longitude') longitude!: number;
  @date('created_at') createdAt!: Date;
}
