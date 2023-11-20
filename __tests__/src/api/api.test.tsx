import {
  fetchCurrentGeoWeather,
  fetchCurrentCityWeather,
  fetchGeoForecast,
  fetchCityForecast,
} from "../../../src/api/api";
import { config } from "../../../src/util/config";

describe("API Tests", () => {
  const mockWeatherResponse = {
    main: {
      temp: 25,
    },
    weather: [
      {
        description: "Sunny",
      },
    ],
    name: "New York",
    coord: {
      lat: 40.7128,
      lon: -74.006,
    },
  };

  const mockForecastResponse = {
    list: [
      {
        main: {
          temp: 25,
        },
        weather: [
          {
            description: "Sunny",
          },
        ],
        dt_txt: "2022-01-01 12:00:00",
      },
    ],
    city: {
      name: "New York",
      coord: {
        lat: 40.7128,
        lon: -74.006,
      },
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((url) => {
      if (url.includes("forecast")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockForecastResponse),
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockWeatherResponse),
        });
      }
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("fetchCurrentGeoWeather", () => {
    it("fetch current weather based on latitude and longitude", async () => {
      const latitude = 40.7128;
      const longitude = -74.006;
      const API_KEY = config.API_KEY;

      const weatherResponse = await fetchCurrentGeoWeather(latitude, longitude);

      expect(weatherResponse).toEqual({
        temperature: mockWeatherResponse.main.temp,
        description: mockWeatherResponse.weather[0].description,
        city: mockWeatherResponse.name,
        latitude: mockWeatherResponse.coord.lat,
        longitude: mockWeatherResponse.coord.lon,
      });
      expect(fetch).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
      );
    });
  });

  describe("fetchCurrentCityWeather", () => {
    it("fetch current city weather based on city name", async () => {
      const city = "london";
      const API_KEY = config.API_KEY;

      const weatherResponse = await fetchCurrentCityWeather(city);

      expect(weatherResponse).toEqual({
        temperature: mockWeatherResponse.main.temp,
        description: mockWeatherResponse.weather[0].description,
        city: mockWeatherResponse.name,
        latitude: mockWeatherResponse.coord.lat,
        longitude: mockWeatherResponse.coord.lon,
      });
      expect(fetch).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
      );
    });
  });

  describe("fetchCityForecast", () => {
    it("fetch 5 day weather Forecast based on city name ", async () => {
      const latitude = 40.7128;
      const longitude = -74.006;
      const API_KEY = config.API_KEY;

      const forecastResponse = await fetchGeoForecast(latitude, longitude);

      expect(forecastResponse).toEqual([
        {
          city: mockForecastResponse.city.name,
          date: mockForecastResponse.list[0].dt_txt.split(" ")[0],
          description: mockForecastResponse.list[0].weather[0].description,
          latitude: mockForecastResponse.city.coord.lat,
          longitude: mockForecastResponse.city.coord.lon,
          temperature: mockForecastResponse.list[0].main.temp,
          temperatures: mockForecastResponse.list.map((item) => ({
            temperature: item.main.temp,
            time: item.dt_txt.split(" ")[1],
          })),
        },
      ]);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
      );
    });
  });

  describe("fetchCityForecast", () => {
    it("fetch 5 day weather Forecast based on latitude and longitude ", async () => {
      const city = "london";
      const API_KEY = config.API_KEY;

      const forecastResponse = await fetchCityForecast(city);

      expect(forecastResponse).toEqual([
        {
          city: mockForecastResponse.city.name,
          date: mockForecastResponse.list[0].dt_txt.split(" ")[0],
          description: mockForecastResponse.list[0].weather[0].description,
          latitude: mockForecastResponse.city.coord.lat,
          longitude: mockForecastResponse.city.coord.lon,
          temperature: mockForecastResponse.list[0].main.temp,
          temperatures: mockForecastResponse.list.map((item) => ({
            temperature: item.main.temp,
            time: item.dt_txt.split(" ")[1],
          })),
        },
      ]);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&exclude=hourly,minutely,alerts,current&units=metric&appid=${API_KEY}`
      );
    });
  });

  describe("fetchCurrentCityWeather", () => {
    it("handle API errors", async () => {
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
        });
      });

      const city = "london";

      try {
        await fetchCurrentCityWeather(city);
      } catch (error) {
        expect(error).toEqual(
          new Error("Error fetching current weather: Failed to fetch current weather")
        );
      }

  
      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes("forecast")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockForecastResponse),
          });
        } else {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockWeatherResponse),
          });
        }
      });
    });
  });
});
