import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { fetchGeoForecast, fetchCityForecast } from "../../../../src/api/api";
import ForecastScreenContainer from "../../../../src/screens/forecast/forecastscreenContainer";

jest.mock("../../../../src/api/api");

describe("ForecastScreenContainer", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders forecast data when API call succeeds", async () => {
        const mockForecastData = [
            { date: "2022-01-01", temperature: 25, description: "Sunny" },
            { date: "2022-01-02", temperature: 20, description: "Cloudy" },
        ];
        (fetchGeoForecast as jest.Mock).mockResolvedValueOnce(mockForecastData);

        const { findByText } = render(
            <ForecastScreenContainer
                route={{
                    params: {
                        location: { latitude: 0, longitude: 0 },
                        searchValue: null,
                    },
                }}
            />
        );

        await waitFor(() => {
            expect(fetchGeoForecast).toHaveBeenCalledTimes(1);
            expect(findByText("2022-01-01")).toBeTruthy();
            expect(findByText("2022-01-02")).toBeTruthy();
        });
    });

    test("renders loading state while waiting for API response", async () => {
        (fetchGeoForecast as jest.Mock).mockResolvedValueOnce([]);

        const { findByText } = render(
            <ForecastScreenContainer
                route={{
                    params: {
                        location: { latitude: 0, longitude: 0 },
                        searchValue: null,
                    },
                }}
            />
        );

        await waitFor(() => {
            expect(fetchGeoForecast).toHaveBeenCalledTimes(1);
            expect(findByText("Loading...")).toBeTruthy();
        });
    });

    test("renders error message when API call fails", async () => {
        const errorMessage = "Failed to fetch forecast data";
        (fetchGeoForecast as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { findByText } = render(
            <ForecastScreenContainer
                route={{
                    params: {
                        location: { latitude: 0, longitude: 0 },
                        searchValue: null,
                    },
                }}
            />
        );

        await waitFor(() => {
            expect(fetchGeoForecast).toHaveBeenCalledTimes(1);
            expect(findByText(errorMessage)).toBeTruthy();
        });
    });
});
