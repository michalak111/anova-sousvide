import "@testing-library/react-native/extend-expect";

jest.mock("@react-native-async-storage/async-storage", () => {
  return { __esModule: true };
});
