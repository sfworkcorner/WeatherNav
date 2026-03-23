import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MapboxNavigation from '@pawan-pk/react-native-mapbox-navigation';
import {Coordinates} from '../types';

interface NavigationScreenProps {
  origin: Coordinates;
  destination: Coordinates;
  onNavigationFinished: () => void;
  onCancelNavigation: () => void;
}

export default function NavigationScreen({
  origin,
  destination,
  onNavigationFinished,
  onCancelNavigation,
}: NavigationScreenProps) {
  const handleCancel = useCallback(() => {
    onCancelNavigation();
  }, [onCancelNavigation]);

  const handleArrive = useCallback(() => {
    onNavigationFinished();
  }, [onNavigationFinished]);

  return (
    <View style={styles.container}>
      <MapboxNavigation
        startOrigin={{latitude: origin.latitude, longitude: origin.longitude}}
        destination={{latitude: destination.latitude, longitude: destination.longitude}}
        shouldSimulateRoute={false}
        showsEndOfRouteFeedback
        onCancelNavigation={handleCancel}
        onArrive={handleArrive}
        onLocationChange={(location) => {
          console.log('Nav location update:', location.latitude, location.longitude);
        }}
        onRouteProgressChange={(progress) => {
          console.log(
            'Nav progress:',
            `${(progress.distanceRemaining / 1000).toFixed(1)}km`,
            `${Math.round(progress.durationRemaining / 60)}min`,
          );
        }}
        onError={(error) => {
          console.error('Navigation error:', error.message);
        }}
        style={styles.navigation}
      />

      {/* Back button overlay */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleCancel}
        activeOpacity={0.8}>
        <Text style={styles.backButtonText}>Exit Navigation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigation: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
