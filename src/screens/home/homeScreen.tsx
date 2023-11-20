import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import LocationSearch from "../../components/searchBar";

interface Navigation {
  navigate: (screen: string, params: any) => void;
}

interface Weather {
  city: string;
  description: string;
  temperature: number;
}

interface HomeScreenProps {
  navigation: Navigation;
  currentWeather: Weather | null;
  currentLocation: { latitude: number; longitude: number } | null;
  loading: boolean;
  isValidData: boolean;
  errorMsg: string | null;
  searchValue: string | null;
  onSearch: (value: string | null) => void;
  onCurrentWeatherPress: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  currentWeather,
  currentLocation,
  loading,
  isValidData,
  errorMsg,
  searchValue,
  onSearch,
  onCurrentWeatherPress,
}) => {
  const renderContent = () => {
    if (loading) {
      return (
        <View testID="loading-indicator" style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (isValidData) {
      return (
        <View style={styles.dataContainer}>
          <Text style={styles.text}>{currentWeather?.city}</Text>
          <Text style={[styles.text, { fontSize: 90, margin: 20 }]}>
            {Math.round(currentWeather?.temperature ?? 0)}
            {"\u00b0"}C
          </Text>
          <Text style={styles.text}>{currentWeather?.description}</Text>
        </View>
      );
    }

    return (
      <View style={styles.dataContainer}>
        <Text style={styles.text}>oops something went wrong.Please enter a valid location and confirm we are connected to internet</Text>
        <Text style={{fontSize:4}}>{errorMsg}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LocationSearch onSearch={onSearch} />
      {renderContent()}
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.dataValues}
          testID="current-weather-button"
          accessible={true}
          onPress={() => {
            onCurrentWeatherPress();
            onSearch(null);
          }}
        >
          <Text style={styles.buttonText}>Current Weather</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.dataValues,
            {
              backgroundColor: isValidData ? "#246EE9" : "#A9A9A9",
            },
          ]}
          disabled={!isValidData}
          onPress={() =>
            navigation.navigate("Forecast", {
              location: currentLocation,
              searchValue: searchValue,
            })
          }
        >
          <Text style={styles.buttonText}>Weather Forecast</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  dataContainer: {
    alignItems: "center",
    margin: 10,
    paddingTop: 10,
    borderRadius: 10,
    height: "50%",
    justifyContent: "space-around",
  },
  btnContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: "5%",
  },
  dataValues: {
    backgroundColor: "#246EE9",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "47%",
  },
});

export default HomeScreen;
