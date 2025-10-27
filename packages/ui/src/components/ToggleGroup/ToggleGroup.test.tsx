import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentPropsWithoutRef } from "react";
import { vi } from "vitest";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

import ToggleGroup from "./ToggleGroup";

const renderToggleGroup = (
  props: ComponentPropsWithoutRef<typeof ToggleGroup.Root>,
) => {
  return renderWithProviders(
    <ToggleGroup.Root {...props}>
      <ToggleGroup.Item value="one">One</ToggleGroup.Item>
      <ToggleGroup.Item value="two">Two</ToggleGroup.Item>
      <ToggleGroup.Item value="three">Three</ToggleGroup.Item>
    </ToggleGroup.Root>,
  );
};

describe("ToggleGroup", () => {
  const user = userEvent.setup();

  it("should have no accessibility errors when single", async () => {
    const { container } = renderToggleGroup({
      type: "single",
    });
    await expectNoAccessibilityErrors(container);
  });

  it("should have no accessibility errors when multiple", async () => {
    const { container } = renderToggleGroup({
      type: "multiple",
    });
    await expectNoAccessibilityErrors(container);
  });

  it("can only select one when single", async () => {
    const mockChange = vi.fn();
    renderToggleGroup({
      type: "single",
      onValueChange: mockChange,
    });

    await user.click(screen.getByRole("radio", { name: /one/i }));

    expect(mockChange).toHaveBeenCalledWith("one");

    await user.click(screen.getByRole("radio", { name: /two/i }));

    expect(mockChange).toHaveBeenCalledWith("two");

    await user.click(screen.getByRole("radio", { name: /three/i }));

    expect(mockChange).toHaveBeenCalledWith("three");
  });

  it("can select more than one when multiple", async () => {
    const mockChange = vi.fn();
    renderToggleGroup({
      type: "multiple",
      onValueChange: mockChange,
    });

    await user.click(screen.getByRole("button", { name: /one/i }));

    expect(mockChange).toHaveBeenCalledWith(["one"]);

    await user.click(screen.getByRole("button", { name: /two/i }));

    expect(mockChange).toHaveBeenCalledWith(["one", "two"]);

    await user.click(screen.getByRole("button", { name: /three/i }));

    expect(mockChange).toHaveBeenCalledWith(["one", "two", "three"]);
  });
});
