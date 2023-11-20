import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreenContainer from "./home/homeScreenContainer";
import ForecastScreenContainer from "./forecast/forecastscreenContainer";

const Stack = createNativeStackNavigator();

//navigation stack for multiple screen using NavigationContainer and Stack.Navigator

const Screens: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Home Screen */}
        <Stack.Screen
          testID="LiveWeather"
          name="Home"
          component={HomeScreenContainer}
          options={{ title: "LiveWeather" }}
        />

        {/* Forecast Screen */}
        <Stack.Screen
          testID="WeatherForecast"
          name="Forecast"
          component={ForecastScreenContainer}
          options={{ title: "WeatherForecast" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Screens;
