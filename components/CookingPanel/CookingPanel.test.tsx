import { render, screen, userEvent } from "@testing-library/react-native";
import { CookingPanel } from "@/components/CookingPanel/CookingPanel";
import { ComponentProps } from "react";
import { AnovaService } from "@/services/AnovaService";

jest.mock("@expo/vector-icons");

const props = (): ComponentProps<typeof CookingPanel> => ({
  state: {},
  onStopClick: jest.fn(),
  onStartClick: jest.fn(),
  onTempClick: jest.fn(),
  onTimerClick: jest.fn(),
});

describe("CookingPanel", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays cooking temperature", () => {
    render(<CookingPanel {...props()} state={{ temperature: "30", targetTemperature: "80" }} />);

    expect(screen.getByText("30")).toBeTruthy();
    expect(screen.getByText(/80/)).toBeTruthy();
  });

  describe("cooking time", () => {
    it("is correct using timer value", () => {
      render(<CookingPanel {...props()} state={{ timer: "130" }} />);

      expect(screen.getByText("2h 10m")).toBeTruthy();
    });

    it("is correct with no value", () => {
      render(<CookingPanel {...props()} state={{ timer: "0 stopped" }} />);

      expect(screen.getByText("0h 00m")).toBeTruthy();
    });

    it("fallbacks to timer set if no value", () => {
      render(<CookingPanel {...props()} state={{ timer: "0", timerSet: "50" }} />);

      expect(screen.getByText("0h 50m")).toBeTruthy();
    });
  });

  it("calls callback fn when temperature button clicked", async () => {
    const callback = jest.fn();
    const user = userEvent.setup();
    render(<CookingPanel {...props()} state={{ status: "stop" }} onTempClick={callback} />);

    await user.press(screen.getByLabelText("Set temperature"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls callback fn when timer button clicked", async () => {
    const callback = jest.fn();
    const user = userEvent.setup();
    render(<CookingPanel {...props()} state={{ status: "stop" }} onTimerClick={callback} />);

    await user.press(screen.getByLabelText("Set time"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it.each<[AnovaService.CookingState["status"], "start" | "stop"]>([
    ["stop", "start"],
    ["stopped", "start"],
    ["low water", "start"],
    ["start", "stop"],
    ["running", "stop"],
  ])("displays correct button depending on status", (status, button) => {
    render(<CookingPanel {...props()} state={{ status }} />);
    expect(screen.getByLabelText(new RegExp(button, "i"))).toBeTruthy();
  });

  it("calls start callback fn when play/stop button clicked", async () => {
    const callback = jest.fn();
    const user = userEvent.setup();
    render(<CookingPanel {...props()} state={{ status: "stop" }} onStartClick={callback} />);

    await user.press(screen.getByLabelText("Start"));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("calls stop callback fn when play/stop button clicked", async () => {
    const callback = jest.fn();
    const user = userEvent.setup();
    render(<CookingPanel {...props()} state={{ status: "start" }} onStopClick={callback} />);

    await user.press(screen.getByLabelText("Stop"));
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
