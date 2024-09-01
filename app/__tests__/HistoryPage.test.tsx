import { render, screen, userEvent } from "@testing-library/react-native";
import HistoryPage from "@/app/(tabs)/home/history";
import { useHistoryStore } from "@/stores/historyStore";
import { router } from "expo-router";

describe("History", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays list items", () => {
    useHistoryStore.setState({
      history: [
        { id: "1", time: 1, cookParams: { timeInMinutes: "0", temperatureCelsius: "0" } },
        { id: "2", time: 2, cookParams: { timeInMinutes: "0", temperatureCelsius: "0" } },
      ],
    });

    render(<HistoryPage />);

    expect(screen.getAllByTestId("HistoryItem")).toHaveLength(2);
  });

  it("displays history item data", () => {
    useHistoryStore.setState({
      history: [{ id: "1", time: 1, cookParams: { timeInMinutes: "70", temperatureCelsius: "85" } }],
    });

    render(<HistoryPage />);

    expect(screen.getByText(/1h 10m/)).toBeTruthy();
    expect(screen.getByText(/85/)).toBeTruthy();
  });

  it("should remove item", async () => {
    const user = userEvent.setup();
    useHistoryStore.setState({
      history: [
        { id: "1", time: 1, cookParams: { timeInMinutes: "0", temperatureCelsius: "0" } },
        { id: "2", time: 2, cookParams: { timeInMinutes: "0", temperatureCelsius: "0" } },
      ],
    });

    render(<HistoryPage />);

    const [first] = screen.getAllByTestId("remove-history-item");
    await user.press(first);

    expect(screen.getAllByTestId("HistoryItem")).toHaveLength(1);
  });

  it("should navigate to device screen with cooking params", async () => {
    const user = userEvent.setup();
    const routerSpy = jest.spyOn(router, "navigate").mockImplementationOnce(() => {});
    useHistoryStore.setState({
      history: [{ id: "1", time: 1, cookParams: { timeInMinutes: "0", temperatureCelsius: "0" } }],
    });

    render(<HistoryPage />);

    await user.press(screen.getByTestId("cook-history-item"));

    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledWith({
      pathname: "/device",
      params: {
        temperatureCelsius: "0",
        timeInMinutes: "0",
      },
    });
  });
});
