/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import React from "react";
import { render } from "../../helpers/testUtils";
import Dialog from "./Dialog";
import type { DialogProps, Color } from "./Dialog";

const defaultProps = {
  isOpen: true, // isOpen true by default so we don't need to keep opening it.
  color: "primary" as Color,
  title: "title",
  children: "content",
  onDismiss: jest.fn() as (
    e: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
  ) => void,
};

const renderDialog = ({ children, ...props }: DialogProps) => {
  return render(<Dialog {...props}>{children}</Dialog>);
};

describe("Dialog", () => {
  it("Should not render if closed", () => {
    renderDialog({
      ...defaultProps,
      isOpen: false,
    });

    expect(
      screen.queryByRole("dialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("Should render if open", () => {
    renderDialog(defaultProps);

    expect(
      screen.queryByRole("dialog", { name: /title/i }),
    ).toBeInTheDocument();
  });

  it("Should call onDismiss on close", () => {
    const handleDismiss = jest.fn();
    const { getByText } = renderDialog({
      ...defaultProps,
      onDismiss: handleDismiss,
    });

    fireEvent.click(getByText(/close/i));

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it("Should render subtitle", () => {
    const subtitle = "subtitle";
    const { getByText } = renderDialog({
      ...defaultProps,
      subtitle,
    });

    expect(getByText(subtitle)).toBeInTheDocument();
  });
});
