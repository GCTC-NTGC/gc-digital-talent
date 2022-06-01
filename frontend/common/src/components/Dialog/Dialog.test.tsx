/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Dialog from "./Dialog";
import type { DialogProps, Color } from "./Dialog";

const defaultProps = {
  isOpen: true, // isOpen true by default so we don't need to keep opening it.
  color: "primary" as Color,
  title: "title",
  content: "content",
  onDismiss: jest.fn() as (
    e: React.MouseEvent<Element> | React.KeyboardEvent<Element>,
  ) => void,
};

const renderDialog = (props: DialogProps & { content: string }) => {
  return render(<Dialog {...props}>{props.content}</Dialog>);
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

  it("should render subtitle", () => {
    const subtitle = "subtitle";
    const { getByText } = renderDialog({
      ...defaultProps,
      subtitle,
    });

    expect(getByText(subtitle)).toBeInTheDocument();
  });
});
