import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LocationSearchProps {
  onSearch: (value: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onSearch }) => {
  const [text, onChangeText] = useState("");

  const handleSearch = () => {
    // Call the onSearch callback with the search value
    onSearch(text);

    // Clear the text input after search
    onChangeText("");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Search"
          testID="search-input" 
        />
      </SafeAreaView>
      <TouchableOpacity
        testID="searchButton"
        style={styles.button}
        onPress={handleSearch}
        disabled={text.trim() === ""}
      >
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "6%",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 10,
  },
  inputContainer: {
    width: "78%",
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "#246EE9",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    height: 42,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LocationSearch;
