/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { render } from "../../helpers/testUtils";
import AlertDialog from "./AlertDialog";
import type { AlertDialogProps } from "./AlertDialog";

type TestProps = Omit<AlertDialogProps, "leastDestructiveRef" | "onDismiss"> & {
  actions: React.ReactNode;
  onDismiss?: () => void;
};

const defaultProps: TestProps = {
  isOpen: true,
  title: "title",
  children: null,
  actions: null,
};

const TestingAlertDialog = ({ children, isOpen, ...rest }: TestProps) => {
  const ref = React.useRef(null);
  const [isDialogOpen, setIsOpen] = React.useState<boolean>(isOpen);

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={isDialogOpen}
      onDismiss={() => setIsOpen(false)}
      {...rest}
    >
      <AlertDialog.Description>{children}</AlertDialog.Description>
      <AlertDialog.Actions>
        <button type="button" ref={ref}>
          Cancel
        </button>
      </AlertDialog.Actions>
    </AlertDialog>
  );
};

const renderAlertDialog = (props: TestProps) => {
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

  it("should close on ESC press", () => {
    renderAlertDialog(defaultProps);

    act(() => {
      fireEvent.keyDown(screen.getByRole("alertdialog", { name: /title/i }), {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        charCode: 27,
      });
    });

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });
});
