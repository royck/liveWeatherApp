import { act, render, waitFor, fireEvent } from "@testing-library/react-native";
import HomeScreenContainer from "../../../../src/screens/home/homeScreenContainer";
import * as locationUtils from "../../../../src/api/locationUtils";
import * as api from "../../../../src/api/api";

jest.mock("../../../../src/api/locationUtils");
jest.mock("../../../../src/api/api");

const getCurrentLocation = locationUtils.getCurrentLocation as jest.Mock;
const fetchCurrentGeoWeather = api.fetchCurrentGeoWeather as jest.Mock;

describe("HomeScreenContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders", () => {
    render(<HomeScreenContainer navigation={{ navigate: jest.fn() }} />);
  });

  it("fetches the current location and weather data correctly", async () => {
    const mockLocation = { latitude: 123, longitude: 456 };
    const mockWeatherData = {
      city: "Test City",
      description: "Test Description",
      temperature: 25,
    };

    getCurrentLocation.mockResolvedValueOnce(mockLocation);
    fetchCurrentGeoWeather.mockResolvedValueOnce(mockWeatherData);

    const { getByText } = render(
      <HomeScreenContainer navigation={{ navigate: jest.fn() }} />
    );

    await waitFor(() => {
      expect(getCurrentLocation).toHaveBeenCalledTimes(1);
      expect(fetchCurrentGeoWeather).toHaveBeenCalledWith(
        mockLocation.latitude,
        mockLocation.longitude
      );
      expect(getByText("Test City")).toBeTruthy(); 
      expect(getByText("Test Description")).toBeTruthy(); 
      expect(getByText("25°C")).toBeTruthy(); 
    });
  });

  it("updates the search correctly", () => {
    const { getByTestId } = render(<HomeScreenContainer />);

    const searchInput = getByTestId("search-input");

    fireEvent.changeText(searchInput, "New Search Value");

    expect(searchInput.props.value).toBe("New Search Value");
  });

  it("updates the current weather and location correctly when the search changes", async () => {
    const mockLocation = { latitude: 123, longitude: 456 };
    const mockWeatherData = {
      city: "Test City",
      description: "Test Description",
      temperature: 25,
    };

    getCurrentLocation.mockResolvedValue(mockLocation);
    fetchCurrentGeoWeather.mockResolvedValue(mockWeatherData);

    const { getByTestId } = render(
      <HomeScreenContainer navigation={{ navigate: jest.fn() }} />
    );

    const searchInput = getByTestId("search-input");

    fireEvent.changeText(searchInput, "Test City"); 
  });

  it("handles the 'Current Weather' button press correctly", async () => {
    const mockLocation = { latitude: 123, longitude: 456 };

    getCurrentLocation.mockResolvedValueOnce(mockLocation);
    fetchCurrentGeoWeather.mockResolvedValueOnce({
      city: "Test City",
      description: "Test Description",
    });

    const { getByTestId } = render(
      <HomeScreenContainer navigation={{ navigate: jest.fn() }} />
    );

    const currentWeatherButton = getByTestId("current-weather-button");

    await act(async () => {
      fireEvent.press(currentWeatherButton);
      await waitFor(() => {
        expect(getCurrentLocation).toHaveBeenCalledTimes(2);
        expect(fetchCurrentGeoWeather).toHaveBeenCalledWith(
          mockLocation.latitude,
          mockLocation.longitude
        );
      });
    });
  });
});
