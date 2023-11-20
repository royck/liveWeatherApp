import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeScreen from "../../../../src/screens/home/homeScreen";

describe("HomeScreen", () => {
    const mockNavigation = {
        navigate: jest.fn(),
    };

    const mockCurrentWeather = {
        city: "New York",
        description: "Sunny",
        temperature: 25,
    };

    const mockCurrentLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
    };

    const mockOnSearch = jest.fn();
    const mockOnCurrentWeatherPress = jest.fn();

    it("render loading indicator when loading is true", () => {
        const { getByTestId } = render(
            <HomeScreen
                navigation={mockNavigation}
                currentWeather={null}
                currentLocation={null}
                loading={true}
                isValidData={false}
                errorMsg={null}
                searchValue={null}
                onSearch={mockOnSearch}
                onCurrentWeatherPress={mockOnCurrentWeatherPress}
            />
        );

        expect(getByTestId("loading-indicator")).toBeTruthy();
    });

    it("render current weather data when isValidData is true", () => {
        const { getByText } = render(
            <HomeScreen
                navigation={mockNavigation}
                currentWeather={mockCurrentWeather}
                currentLocation={mockCurrentLocation}
                loading={false}
                isValidData={true}
                errorMsg={null}
                searchValue={null}
                onSearch={mockOnSearch}
                onCurrentWeatherPress={mockOnCurrentWeatherPress}
            />
        );

        expect(getByText(mockCurrentWeather.city)).toBeTruthy();
        expect(getByText(`${Math.round(mockCurrentWeather.temperature)}°C`)).toBeTruthy();
        expect(getByText(mockCurrentWeather.description)).toBeTruthy();
    });

    it("render error message when isValidData is false", () => {
        const mockErrorMsg = "Error fetching weather data";

        const { getByText } = render(
            <HomeScreen
                navigation={mockNavigation}
                currentWeather={null}
                currentLocation={null}
                loading={false}
                isValidData={false}
                errorMsg={mockErrorMsg}
                searchValue={null}
                onSearch={mockOnSearch}
                onCurrentWeatherPress={mockOnCurrentWeatherPress}
            />
        );

        expect(getByText(mockErrorMsg)).toBeTruthy();
    });

    it("call onCurrentWeatherPress and onSearch when current weather button is pressed", () => {
        const { getByTestId } = render(
            <HomeScreen
                navigation={mockNavigation}
                currentWeather={mockCurrentWeather}
                currentLocation={mockCurrentLocation}
                loading={false}
                isValidData={true}
                errorMsg={null}
                searchValue={null}
                onSearch={mockOnSearch}
                onCurrentWeatherPress={mockOnCurrentWeatherPress}
            />
        );

        const currentWeatherButton = getByTestId("current-weather-button");
        fireEvent.press(currentWeatherButton);

        expect(mockOnCurrentWeatherPress).toHaveBeenCalled();
        expect(mockOnSearch).toHaveBeenCalledWith(null);
    });

    it("navigate to Forecast screen when weather forecast button is pressed", () => {
        const { getByText } = render(
            <HomeScreen
                navigation={mockNavigation}
                currentWeather={mockCurrentWeather}
                currentLocation={mockCurrentLocation}
                loading={false}
                isValidData={true}
                errorMsg={null}
                searchValue={null}
                onSearch={mockOnSearch}
                onCurrentWeatherPress={mockOnCurrentWeatherPress}
            />
        );

        const weatherForecastButton = getByText("Weather Forecast");
        fireEvent.press(weatherForecastButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith("Forecast", {
            location: mockCurrentLocation,
            searchValue: null,
        });
    });
});
