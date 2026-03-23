# WeatherNav - UAE Weather Navigation App

A React Native CLI app that shows real-time weather conditions across the UAE on an interactive Mapbox map. Users can filter locations by weather type (rain, sunny, cloudy, etc.) and get turn-by-turn navigation to any destination.

## Features

- Interactive Mapbox map centered on UAE
- Real-time weather data from Open-Meteo API (free, no API key)
- Weather markers showing temperature and conditions for 16 UAE cities
- Filter locations by weather type: Rain, Sunny, Cloudy, Storm, Fog, Snow
- Tap any marker to see detailed weather (temperature, humidity, wind, 7-day forecast)
- Turn-by-turn navigation to selected locations using Mapbox Navigation SDK
- Local offline database (WatermelonDB) for caching and favorites
- Android-optimized

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native CLI 0.84 (TypeScript) |
| Maps | `@rnmapbox/maps` (Mapbox Maps SDK) |
| Navigation | `@pawan-pk/react-native-mapbox-navigation` |
| Weather API | [Open-Meteo](https://open-meteo.com) (free, no key) |
| Local DB | WatermelonDB (SQLite) |
| State | Zustand |
| UI | Bottom Sheet, Reanimated, Gesture Handler |

## Prerequisites

- Node.js >= 18
- JDK 17
- Android Studio with:
  - Android SDK 36
  - Android Build Tools 36.0.0
  - NDK 27.1.12297006
- A Mapbox account (free): [Sign up](https://account.mapbox.com/auth/signup/)

## Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd WeatherNav
npm install
```

### 2. Mapbox Tokens

You need **two** Mapbox tokens:

#### a) Public Token (starts with `pk.ey...`)
1. Go to [Mapbox Tokens](https://account.mapbox.com/access-tokens/)
2. Copy your **Default public token**
3. Replace the placeholder in:
   - `android/app/src/main/res/values/mapbox_access_token.xml`
   - `src/utils/constants.ts` (the `MAPBOX_ACCESS_TOKEN` variable)

#### b) Secret Token (starts with `sk.ey...`)
1. Go to [Mapbox Tokens](https://account.mapbox.com/access-tokens/)
2. Click **Create a token**
3. Enable the **Downloads:Read** scope
4. Copy the token
5. Replace `YOUR_SECRET_MAPBOX_TOKEN_HERE` in `android/gradle.properties`

### 3. Run the App

```bash
# Start Metro bundler
npx react-native start

# In another terminal, build and run on Android
npx react-native run-android
```

## Project Structure

```
src/
├── screens/
│   ├── MapScreen.tsx          # Main map with weather markers
│   └── NavigationScreen.tsx   # Turn-by-turn navigation
├── components/
│   ├── WeatherFilterBar.tsx   # Filter buttons (Rain, Sunny, etc.)
│   ├── WeatherBottomSheet.tsx # Detail sheet with weather info
│   ├── LoadingOverlay.tsx     # Loading indicator
│   └── ErrorBanner.tsx        # Error display
├── services/
│   └── weatherService.ts      # Open-Meteo API integration
├── hooks/
│   ├── useWeather.ts          # Weather data hook
│   └── useLocation.ts         # GPS location hook
├── store/
│   └── weatherStore.ts        # Zustand state management
├── database/
│   ├── index.ts               # WatermelonDB setup
│   ├── schema/index.ts        # DB schema
│   └── models/                # DB models
├── types/
│   └── index.ts               # TypeScript interfaces
└── utils/
    ├── weatherCodes.ts        # WMO weather code mappings
    ├── constants.ts           # Config & UAE cities
    └── helpers.ts             # Utility functions
```

## How It Works

1. **App loads** - Map shows UAE centered view with user's location
2. **Weather fetched** - Open-Meteo API returns weather for 16 UAE cities
3. **Markers displayed** - Each city shows weather icon + temperature
4. **Filter** - Tap a filter (e.g., "Rain") to only show rainy locations
5. **Tap marker** - Bottom sheet shows detailed weather + 7-day forecast
6. **Navigate** - Tap "Navigate Here" for turn-by-turn directions

## APIs Used

### Open-Meteo (Weather)
- **Cost:** Free for non-commercial use
- **API Key:** Not required
- **Docs:** https://open-meteo.com/en/docs
- **Data:** Temperature, rain, wind, humidity, cloud cover, weather codes, 7-day forecast

### Mapbox (Maps + Navigation)
- **Cost:** Free tier covers 25,000 map MAU + 100 navigation MAU
- **Docs:** https://docs.mapbox.com
- **Features:** Interactive maps, turn-by-turn navigation, geocoding

## Free Tier Limits

For 3 users, everything is well within free limits:

| Service | Free Limit | Your Usage |
|---|---|---|
| Mapbox Maps | 25,000 MAU | 3 |
| Mapbox Navigation | 100 MAU | 3 |
| Open-Meteo | 10,000 requests/day | ~50-100/day |

## License

MIT
