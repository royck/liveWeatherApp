import { config } from '../util/config';

const API_CURRENT_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_FORECAST_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const API_KEY = config.API_KEY;

interface WeatherResponse {
  temperature: number;
  description: string;
  city: string;
  date?: string;
  latitude: number;
  longitude: number;
}

// Fetch current weather data based on geographic coordinates
export const fetchCurrentGeoWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherResponse> => {
  try {
    const response = await fetch(
      `${API_CURRENT_BASE_URL}?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();

    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
    };
  } catch (error: any) {
    // Handle error
    throw new Error(`Error fetching current weather: ${error.message}`);
  }
};

// Fetch current weather data based on city name
export const fetchCurrentCityWeather = async (
  city: string
): Promise<WeatherResponse> => {
  try {
    const response = await fetch(
      `${API_CURRENT_BASE_URL}?q=${city}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    const data = await response.json();

    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      latitude: data.coord.lat,
      longitude: data.coord.lon,
    };
  } catch (error: any) {
    // Handle error
    throw new Error(`Error fetching current weather: ${error.message}`);
  }
};

// Fetch 5-day weather forecast based on geographic coordinates
export const fetchGeoForecast = async (
  latitude: number,
  longitude: number
): Promise<WeatherResponse[]> => {
  try {
    const response = await fetch(
      `${API_FORECAST_BASE_URL}?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch 5-day forecast");
    }

    const data = await response.json();

    // Group data by day
    const groupedByDay: { [date: string]: WeatherResponse[] } = {};
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];

      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }

      groupedByDay[date].push({
        temperature: item.main.temp,
        description: item.weather[0].description,
        city: data.city.name,
        date: item.dt_txt,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
      });
    });

    // Transform grouped data into WeatherResponse type
    const forecastData: WeatherResponse[] = Object.keys(groupedByDay).map(
      (date) => {
        const temperatures = groupedByDay[date].map((item) => ({
          time: item.date?.split(" ")[1] || "",
          temperature: item.temperature,
        }));

        return {
          temperatures: temperatures,
          description: getCommonDescription(groupedByDay[date]),
          city: data.city.name,
          date: date,
          latitude: data.city.coord.lat,
          longitude: data.city.coord.lon,
          temperature: temperatures[0]?.temperature || 0,
        };
      }
    );

    return forecastData;
  } catch (error: any) {
    // Handle error
    throw new Error(`Error fetching 5-day forecast: ${error.message}`);
  }
};

// Fetch 5-day weather forecast based on city name
export const fetchCityForecast = async (
  city: string
): Promise<WeatherResponse[]> => {
  try {
    const response = await fetch(
      `${API_FORECAST_BASE_URL}?q=${city}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch 5-day forecast");
    }

    const data = await response.json();

    // Group data by day
    const groupedByDay: { [date: string]: WeatherResponse[] } = {};
    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];

      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }

      groupedByDay[date].push({
        temperature: item.main.temp,
        description: item.weather[0].description,
        city: data.city.name,
        date: item.dt_txt,
        latitude: data.city.coord.lat,
        longitude: data.city.coord.lon,
      });
    });

    // Transform grouped data into WeatherResponse type
    const forecastData: WeatherResponse[] = Object.keys(groupedByDay).map(
      (date) => {
        const temperatures = groupedByDay[date].map((item) => ({
          time: item.date?.split(" ")[1] || "",
          temperature: item.temperature,
        }));

        return {
          temperatures: temperatures,
          description: getCommonDescription(groupedByDay[date]),
          city: data.city.name,
          date: date,
          latitude: data.city.coord.lat,
          longitude: data.city.coord.lon,
          temperature: temperatures[0]?.temperature || 0,
        };
      }
    );

    return forecastData;
  } catch (error: any) {
    // Handle error
    throw new Error(`Error fetching 5-day forecast: ${error.message}`);
  }
};

// Helper function to get the most common description
const getCommonDescription = (data: WeatherResponse[]): string => {
  const descriptions = data.map((item) => item.description);
  const counts: { [description: string]: number } = {};
  let mostCommonDescription = "";
  let maxCount = 0;

  descriptions.forEach((description) => {
    counts[description] = (counts[description] || 0) + 1;

    if (counts[description] > maxCount) {
      mostCommonDescription = description;
      maxCount = counts[description];
    }
  });

  return mostCommonDescription;
};
