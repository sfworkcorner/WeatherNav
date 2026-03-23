import {appSchema, tableSchema} from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'favorite_locations',
      columns: [
        {name: 'name', type: 'string'},
        {name: 'latitude', type: 'number'},
        {name: 'longitude', type: 'number'},
        {name: 'created_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'weather_cache',
      columns: [
        {name: 'latitude', type: 'number'},
        {name: 'longitude', type: 'number'},
        {name: 'temperature', type: 'number'},
        {name: 'weather_code', type: 'number'},
        {name: 'precipitation', type: 'number'},
        {name: 'rain', type: 'number'},
        {name: 'wind_speed', type: 'number'},
        {name: 'humidity', type: 'number'},
        {name: 'description', type: 'string'},
        {name: 'icon', type: 'string'},
        {name: 'category', type: 'string'},
        {name: 'fetched_at', type: 'number'},
      ],
    }),
    tableSchema({
      name: 'recent_navigations',
      columns: [
        {name: 'destination_name', type: 'string'},
        {name: 'destination_lat', type: 'number'},
        {name: 'destination_lon', type: 'number'},
        {name: 'weather_at_destination', type: 'string'},
        {name: 'navigated_at', type: 'number'},
      ],
    }),
  ],
});
