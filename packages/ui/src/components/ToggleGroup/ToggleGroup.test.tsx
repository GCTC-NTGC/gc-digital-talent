/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import React from "react";
import { screen, fireEvent } from "@testing-library/react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import ToggleGroup from "./ToggleGroup";
import type { ToggleGroupProps } from "./ToggleGroup";

const renderToggleGroup = (
  props: React.ComponentPropsWithoutRef<ToggleGroupProps>,
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
  it("should have no accessibility errors when single", async () => {
    const { container } = renderToggleGroup({
      type: "single",
    });
    await axeTest(container);
  });

  it("should have no accessibility errors when multiple", async () => {
    const { container } = renderToggleGroup({
      type: "multiple",
    });
    await axeTest(container);
  });

  it("can only select one when single", async () => {
    const mockChange = jest.fn();
    renderToggleGroup({
      type: "single",
      onValueChange: mockChange,
    });

    fireEvent.click(await screen.getByRole("radio", { name: /one/i }));

    expect(mockChange).toHaveBeenCalledWith("one");

    fireEvent.click(await screen.getByRole("radio", { name: /two/i }));

    expect(mockChange).toHaveBeenCalledWith("two");

    fireEvent.click(await screen.getByRole("radio", { name: /three/i }));

    expect(mockChange).toHaveBeenCalledWith("three");
  });

  it("can select more than one when multiple", async () => {
    const mockChange = jest.fn();
    renderToggleGroup({
      type: "multiple",
      onValueChange: mockChange,
    });

    fireEvent.click(await screen.getByRole("button", { name: /one/i }));

    expect(mockChange).toHaveBeenCalledWith(["one"]);

    fireEvent.click(await screen.getByRole("button", { name: /two/i }));

    expect(mockChange).toHaveBeenCalledWith(["one", "two"]);

    fireEvent.click(await screen.getByRole("button", { name: /three/i }));

    expect(mockChange).toHaveBeenCalledWith(["one", "two", "three"]);
  });
});
