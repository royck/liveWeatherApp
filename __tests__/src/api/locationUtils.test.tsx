import { getCurrentLocation } from '../../../src/api/locationUtils';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('getCurrentLocation', () => {
    it('return the current location', async () => {
        (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({ status: 'granted' });
        (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
            coords: {
              latitude: 37.7749,
              longitude: -122.4194,
            },
          });

        const location = await getCurrentLocation();

        expect(location).not.toBeNull();

        expect(location?.latitude).toBe(37.7749);
        expect(location?.longitude).toBe(-122.4194);
    });


    it('return null if the location cannot be obtained', async () => {
        jest.mock('expo-location', () => ({
            getCurrentPositionAsync: jest.fn().mockRejectedValueOnce(new Error('Unable to get location')),
        }));

        const location = await getCurrentLocation();

        expect(location).toBeNull();
    });
});
