/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import React from "react";
import { render } from "../../helpers/testUtils";
import AlertDialog from "./AlertDialog";
import type { AlertDialogProps } from "./AlertDialog";

const defaultProps: AlertDialogProps & {
  actions: React.ReactNode;
} = {
  isOpen: true,
  onDismiss: jest.fn(),
  title: "title",
  children: null,
  actions: null,
};

const TestingAlertDialog = ({ children, ...rest }: AlertDialogProps) => {
  const ref = React.useRef(null);

  return (
    <AlertDialog leastDestructiveRef={ref} {...rest}>
      <AlertDialog.Description>{children}</AlertDialog.Description>
      <AlertDialog.Actions>
        <button type="button" ref={ref}>
          Cancel
        </button>
      </AlertDialog.Actions>
    </AlertDialog>
  );
};

const renderAlertDialog = (props: AlertDialogProps) => {
  return render(<TestingAlertDialog {...props} />);
};

describe("AlertDialog", () => {
  it("should not render if closed", () => {
    renderAlertDialog({
      ...defaultProps,
      isOpen: false,
    });

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("should render if open", () => {
    renderAlertDialog(defaultProps);

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).toBeInTheDocument();
  });
});
