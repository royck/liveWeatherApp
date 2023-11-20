import * as Location from 'expo-location';

// Function to get the current device location
export const getCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    // Request foreground location permissions
    const { status } = await Location.requestForegroundPermissionsAsync();

    // Check if permission is granted
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    // Get the current device location
    const currentLocation = await Location.getCurrentPositionAsync({});

    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
  } catch (error: any) {
    // Handle error
    console.error(`Error getting location: ${error.message}`);
    return null;
  }
};
