import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";

interface Forecast {
  date: string;
  temperature: number;
  description: string;
  city: string;
}

interface ForecastScreenProps {
  loading: boolean;
  forecastData: Forecast[];
  errorMsg: string | null;
  searchValue: string | null;
}

const ForecastScreen: React.FC<ForecastScreenProps> = ({
  loading,
  forecastData,
  errorMsg,
  searchValue,
}) => {
  //  loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{forecastData[0]?.city}</Text>
      <SafeAreaView style={styles.scrollViewContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {forecastData.map((data) => (
            <View key={data.date} style={styles.blockWrapper}>
              <View style={styles.textContainer}>
                <Text style={styles.descriptionText}>{data.description}</Text>
                <Text style={styles.dateText}>{data.date}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.temperatureText}>
                  {Math.round(data.temperature)}{"\u00b0"}C
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      {errorMsg && <Text style={styles.errorText}>Error: {errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 20,
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 8,
  },
  blockWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    margin: 8,
    borderRadius: 10,
    height: 80,
    alignItems: "center",
  },
  textContainer: {
    alignItems: "flex-start",
  },
  descriptionText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 18,
    color: "#888",
    marginTop: 5,
  },
  temperatureText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default ForecastScreen;
