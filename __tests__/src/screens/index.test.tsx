import React from "react";
import { render } from "@testing-library/react-native";
import Screens from "../../../src/screens/Index";

describe("Screens", () => {
    test("renders Screens component", () => {
        render(<Screens />);
    });
});
