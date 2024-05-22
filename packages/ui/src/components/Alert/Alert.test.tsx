/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Alert, { AlertProps } from "./Alert";

const defaultProps = {
  title: "Alert test",
  type: "warning",
};

const renderAlert = (props: Omit<AlertProps, "children">) => {
  return renderWithProviders(
    <Alert.Root {...props}>
      <p>This is an alert test.</p>
    </Alert.Root>,
  );
};

describe("Alert", () => {
  it("should not have accessibility errors, error", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "error",
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, info", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "info",
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, success", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "success",
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, warning", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "warning",
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, error, dismissible", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "error",
      dismissible: true,
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, info, dismissible", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "info",
      dismissible: true,
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, success, dismissible", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "success",
      dismissible: true,
    });
    await axeTest(container);
  });

  it("should not have accessibility errors, warning, dismissible", async () => {
    const { container } = renderAlert({
      ...defaultProps,
      type: "warning",
      dismissible: true,
    });
    await axeTest(container);
  });
});
