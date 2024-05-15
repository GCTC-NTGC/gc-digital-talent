/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import * as React from "react";
import { screen } from "@testing-library/react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Stepper from "./Stepper";
import { defaultSteps } from "./testUtils";

const renderStepper = (
  props: React.ComponentPropsWithoutRef<typeof Stepper>,
) => {
  return renderWithProviders(<Stepper {...props} />);
};

const defaultProps = {
  steps: defaultSteps,
  label: "Test stepper",
  currentIndex: defaultSteps.length - 2,
};

describe("Stepper", () => {
  it("should have no accessibility errors", async () => {
    // These props present all different states available for a11y testing
    const { container } = renderStepper(defaultProps);

    await axeTest(container);
  });

  it("should render active step", async () => {
    renderStepper({ ...defaultProps, currentIndex: defaultSteps.length - 1 });

    // 5 total steps, default index set should be 4th step
    const step = await screen.findByRole("link", {
      name: "Step, current, Step Five",
    });

    expect(step).toBeInTheDocument();
    expect(step).toHaveAttribute("aria-current", "step");
  });

  it("should render error step", async () => {
    renderStepper(defaultProps);

    const step = await screen.findByRole("link", {
      name: "Step error, Step Two",
    });

    expect(step).toBeInTheDocument();
  });

  it("should render completed step", async () => {
    renderStepper(defaultProps);

    const step = await screen.findByRole("link", {
      name: "Step completed, Step One",
    });

    expect(step).toBeInTheDocument();
  });

  it("should render disabled step", async () => {
    renderStepper(defaultProps);

    const step = await screen.findByRole("link", {
      name: "Step Five",
    });

    expect(step).toBeInTheDocument();
    expect(step).toHaveAttribute("aria-disabled", "true");
  });

  it("should update when current index changes", async () => {
    const { rerender } = renderStepper({
      ...defaultProps,
      currentIndex: 0,
    });

    const stepOne = await screen.findByRole("link", {
      name: "Step, current, Step One",
    });

    expect(stepOne).toBeInTheDocument();
    expect(stepOne).toHaveAttribute("aria-current", "step");

    rerender(<Stepper {...defaultProps} currentIndex={1} />);

    const stepTwo = await screen.findByRole("link", {
      name: "Step, current, Step Two",
    });

    expect(stepTwo).toBeInTheDocument();
    expect(stepTwo).toHaveAttribute("aria-current", "step");
    expect(stepOne).not.toHaveAttribute("aria-current");
  });
});
