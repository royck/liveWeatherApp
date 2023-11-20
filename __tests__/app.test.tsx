import renderer, { ReactTestRendererJSON } from "react-test-renderer";
import App from "../App";

test("renders correctly", () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe("App", () => {
  it("Has a child component", () => {
    const tree = renderer.create(<App />).toJSON() as ReactTestRendererJSON;
    expect(tree.children).toBeDefined();
  });
});
