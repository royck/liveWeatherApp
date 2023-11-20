import React, { useState, useEffect } from "react";
import { fetchGeoForecast, fetchCityForecast } from "../../api/api";
import ForecastScreen from "./forecastScreen";

interface Location {
  latitude: number;
  longitude: number;
}

interface Forecast {
  date: string;
  temperature: number;
  description: string;
}

interface ForecastScreenContainerProps {
  route: {
    params: {
      location: Location;
      searchValue: string | null;
    };
  };
}

const ForecastScreenContainer: React.FC<ForecastScreenContainerProps> = ({ route }) => {
  // location and searchValue from route params
  const { location, searchValue } = route.params;
  const { latitude, longitude } = location;
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // fetch forecast data based on location and searchValue
    const getForecastData = async () => {
      try {
        const locationForecastData = await (searchValue != null
          ? fetchCityForecast(searchValue)
          : fetchGeoForecast(latitude, longitude));

        setForecastData(locationForecastData);
      } catch (error: any) {
        //handle errors 
        setErrorMsg(`Error fetching forecast data: ${error.message}`);
      } finally {
        // Update loading status
        setLoading(false);
      }
    };

    // fetch forecast data
    getForecastData();
  }, [latitude, longitude, searchValue]);

  // Render the ForecastScreen
  return (
    <ForecastScreen
      loading={loading}
      forecastData={forecastData}
      errorMsg={errorMsg}
      searchValue={searchValue}
    />
  );
};

export default ForecastScreenContainer;
