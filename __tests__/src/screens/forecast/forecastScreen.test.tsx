import React from "react";
import { render } from "@testing-library/react-native";
import ForecastScreen from "../../../../src/screens/forecast/forecastScreen";

describe("ForecastScreen", () => {
    it("render loading text when loading prop is true", () => {
        const { getByText } = render(
            <ForecastScreen
                loading={true}
                forecastData={[]}
                errorMsg={null}
                searchValue={null}
            />
        );

        const loadingText = getByText("Loading...");
        expect(loadingText).toBeDefined();
    });

    it("render forecast data when loading prop is false", () => {
        const forecastData = [
            {
                date: "2022-01-01",
                temperature: 25,
                description: "Sunny",
                city: "New York",
            },
            {
                date: "2022-01-02",
                temperature: 20,
                description: "Cloudy",
                city: "New York",
            },
        ];

        const { getByText } = render(
            <ForecastScreen
                loading={false}
                forecastData={forecastData}
                errorMsg={null}
                searchValue={null}
            />
        );

        const cityText = getByText("New York");
        expect(cityText).toBeDefined();

        const dateText1 = getByText("2022-01-01");
        expect(dateText1).toBeDefined();

        const dateText2 = getByText("2022-01-02");
        expect(dateText2).toBeDefined();

        const temperatureText1 = getByText("25°C");
        expect(temperatureText1).toBeDefined();

        const temperatureText2 = getByText("20°C");
        expect(temperatureText2).toBeDefined();
    });

    it("render error message when errorMsg prop is not null", () => {
        const { getByText } = render(
            <ForecastScreen
                loading={false}
                forecastData={[]}
                errorMsg="Failed to fetch forecast data"
                searchValue={null}
            />
        );

        const errorText = getByText("Error: Failed to fetch forecast data");
        expect(errorText).toBeDefined();
    });
});
