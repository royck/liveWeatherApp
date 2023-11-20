import React from "react";
import LocationSearch from "../../../src/components/searchBar";
import { render, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';

describe("LocationSearch", () => {
    test("calls onSearch callback with the search value when search button is pressed", () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <LocationSearch onSearch={onSearchMock} />
        );

        const searchInput = getByPlaceholderText("Search");
        const searchButton = getByText("Search");

        fireEvent.changeText(searchInput, "New York");
        fireEvent.press(searchButton);

        expect(onSearchMock).toHaveBeenCalledWith("New York");
    });

    test("clears the text input after search button is pressed", () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <LocationSearch onSearch={onSearchMock} />
        );

        const searchInput = getByPlaceholderText("Search");
        const searchButton = getByText("Search");

        fireEvent.changeText(searchInput, "New York");
        fireEvent.press(searchButton);

        expect(searchInput.props.value).toBe("");
    });
    

    test("disables the search button when the text input is empty", () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText, getAllByA11yState, rerender } = render(
          <LocationSearch onSearch={onSearchMock} />
        );
      
        const searchInput = getByPlaceholderText("Search");
        let searchButtons = getAllByA11yState({ disabled: true });
      
        let searchButton = searchButtons.find((button) => button.props.children === "Search");
        expect(searchButton).not.toBeNull();
      
        fireEvent.changeText(searchInput, "New York");
      
        rerender(<LocationSearch onSearch={onSearchMock} />);
      
        searchButtons = getAllByA11yState({ disabled: false });
      
        searchButton = searchButtons.find((button) => button.props.children === "Search");
        expect(searchButton).not.toBeNull();
    });

    test("enables the search button when there is text in the input", () => {
        const onSearchMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(
          <LocationSearch onSearch={onSearchMock} />
        );
      
        const searchInput = getByPlaceholderText("Search");
        const searchButton = getByText("Search");
      
        fireEvent.press(searchButton);
      
        expect(onSearchMock).not.toHaveBeenCalled();
      
        fireEvent.changeText(searchInput, "New York");
      
        fireEvent.press(searchButton);
      
        expect(onSearchMock).toHaveBeenCalledWith("New York");
      });
});
