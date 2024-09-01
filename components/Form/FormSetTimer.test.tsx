import { render, screen } from "@testing-library/react-native";
import { userEvent } from "@testing-library/react-native";
import { FormSetTimer } from "@/components/Form/FormSetTimer";

describe("FormSetTimer", () => {
  it("should display input with empty value", () => {
    render(<FormSetTimer onSave={jest.fn()} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("");
  });

  it("should display initial value", () => {
    render(<FormSetTimer onSave={jest.fn()} initialValue={"20"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("20");
  });

  it("should update when initial value changed", () => {
    const { rerender } = render(<FormSetTimer onSave={jest.fn()} initialValue={"20"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("20");

    rerender(<FormSetTimer onSave={jest.fn()} initialValue={"25"} />);
    expect(screen.getByTestId("input")).toHaveDisplayValue("25");
  });

  it("should display time in human readable format", () => {
    render(<FormSetTimer onSave={jest.fn()} initialValue={"150"} />);
    expect(screen.getByText("2h 30m")).toBeTruthy();
  });

  it("should change value when typing", async () => {
    const user = userEvent.setup();
    render(<FormSetTimer onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "50");

    expect(screen.getByTestId("input")).toHaveDisplayValue("50");
  });

  it("should call onSend function with correct value", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();
    render(<FormSetTimer onSave={onSave} initialValue="50" />);

    await user.press(screen.getByRole("button"));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("50");
  });

  it("should validate if value to low", async () => {
    const user = userEvent.setup();
    render(<FormSetTimer onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "-10");

    expect(screen.getByTestId("input")).toHaveDisplayValue("0");
  });

  it("should validate if value to high", async () => {
    const user = userEvent.setup();
    render(<FormSetTimer onSave={jest.fn()} />);

    await user.type(screen.getByTestId("input"), "6001");

    expect(screen.getByTestId("input")).toHaveDisplayValue("6000");
  });
});
