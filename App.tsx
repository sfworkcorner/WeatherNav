import React, {useState, useCallback} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MapScreen from './src/screens/MapScreen';
import NavigationScreen from './src/screens/NavigationScreen';
import {useWeatherStore} from './src/store/weatherStore';
import {Coordinates} from './src/types';

export default function App(): React.JSX.Element {
  const [isNavigating, setIsNavigating] = useState(false);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const userLocation = useWeatherStore(state => state.userLocation);

  const handleStartNavigation = useCallback(
    (dest: Coordinates) => {
      if (userLocation) {
        setDestination(dest);
        setIsNavigating(true);
      }
    },
    [userLocation],
  );

  const handleNavigationFinished = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
  }, []);

  const handleCancelNavigation = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      {isNavigating && destination && userLocation ? (
        <NavigationScreen
          origin={userLocation}
          destination={destination}
          onNavigationFinished={handleNavigationFinished}
          onCancelNavigation={handleCancelNavigation}
        />
      ) : (
        <MapScreen onStartNavigation={handleStartNavigation} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
