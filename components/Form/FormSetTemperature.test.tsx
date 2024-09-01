import { render, screen } from "@testing-library/react-native";
import { FormSetTemperature } from "@/components/Form/FormSetTemperature";
import { userEvent } from "@testing-library/react-native/build/user-event";

describe("FormSetTemperature", () => {
  it("should display input with empty value", () => {
    render(<FormSetTemperature onSave={jest.fn()} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("");
  });

  it("should display initial value", () => {
    render(<FormSetTemperature onSave={jest.fn()} initialValue={"20"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("20");
  });

  it("should update when initial value changed", () => {
    const { rerender } = render(<FormSetTemperature onSave={jest.fn()} initialValue={"20"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("20");

    rerender(<FormSetTemperature onSave={jest.fn()} initialValue={"25"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("25");
  });

  it("should change value when typing", async () => {
    const user = userEvent.setup();
    render(<FormSetTemperature onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "50");

    expect(screen.getByTestId("input")).toHaveDisplayValue("50");
  });

  it("should call onSend function with correct value", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<FormSetTemperature onSave={onSave} initialValue="50" />);

    await user.press(screen.getByRole("button"));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("50");
  });

  it("should validate if value to low", async () => {
    const user = userEvent.setup();
    render(<FormSetTemperature onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "0");

    expect(screen.getByTestId("input")).toHaveDisplayValue("5");
  });

  it("should validate if value to high", async () => {
    const user = userEvent.setup();
    render(<FormSetTemperature onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "100");

    expect(screen.getByTestId("input")).toHaveDisplayValue("99.9");
  });
});
