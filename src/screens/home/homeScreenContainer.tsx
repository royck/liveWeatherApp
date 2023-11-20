import React, { useState, useEffect, useCallback, useRef } from "react";
import HomeScreen from "./homeScreen";
import { getCurrentLocation } from "../../api/locationUtils";
import { fetchCurrentGeoWeather, fetchCurrentCityWeather } from "../../api/api";

interface Navigation {
  navigate: (screen: string, params: any) => void;
}

interface HomeScreenContainerProps {
  navigation: Navigation;
}

interface Weather {
  city: string;
  description: string;
  latitude: number;
  longitude: number;
  temperature: number;
}

interface Coords {
  latitude: number;
  longitude: number;
}

const HomeScreenContainer: React.FC<HomeScreenContainerProps> = ({
  navigation,
}) => {
  // Ref to track whether the component is mounted
  const isMounted = useRef(true);
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coords | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [validData, setValidData] = useState<boolean>(false);

  // Callback to fetch weather data
  const fetchWeatherData = useCallback(
    async (location: Coords, city: string | null) => {
      try {
        const weatherData = city != null
          ? await fetchCurrentCityWeather(city)
          : await fetchCurrentGeoWeather(location.latitude, location.longitude);
        return weatherData;
      } catch (error: any) {
        throw new Error(`Error fetching weather data: ${error.message}`);
      }
    },
    []
  );

  // Callback to get location and weather
  const getLocationAndWeather = useCallback(async () => {
    setLoading(true);
    setValidData(false);

    try {
      const location = await getCurrentLocation();

      if (!location) {
        throw new Error("Error getting location");
      }

      if (!isMounted.current) return;

      setCurrentLocation(location);

      const weatherData = await fetchWeatherData(location, searchValue);

      if (!isMounted.current) return;

      setCurrentWeather(weatherData);
      setValidData(true);
    } catch (error: any) {
      if (!isMounted.current) return;

      setErrorMsg(`Error getting location or weather: ${error.message}`);
      setValidData(false);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [searchValue, fetchWeatherData]);

  // cleanup to update isMounted ref when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // fetch location and weather data on component mount and searchValue change
  useEffect(() => {
    getLocationAndWeather();
  }, [getLocationAndWeather]);

  // handle search value change
  const handleSearch = (value: string | null) => {
    setSearchValue(value);
  };

  // handle current weather button press
  const onCurrentWeatherPress = () => {
    getLocationAndWeather();
    setSearchValue(null);
  };

  return (
    <HomeScreen
      navigation={navigation}
      currentWeather={currentWeather}
      currentLocation={currentLocation}
      loading={loading}
      errorMsg={errorMsg}
      searchValue={searchValue}
      onSearch={handleSearch}
      isValidData={validData}
      onCurrentWeatherPress={onCurrentWeatherPress}
    />
  );
};

export default HomeScreenContainer;
