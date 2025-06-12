/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentPropsWithoutRef } from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Button from "../Button";
import AlertDialog from "./AlertDialog";

type AlertDialogRootPrimitivePropsWithoutRef = ComponentPropsWithoutRef<
  typeof AlertDialog.Root
>;
const DefaultChildren = () => (
  <>
    <AlertDialog.Trigger>
      <Button>Open Alert Dialog</Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Title>Alert Dialog Title</AlertDialog.Title>
      <AlertDialog.Description>
        Alert Dialog Description
      </AlertDialog.Description>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>
          <Button color="white">Cancel</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button>Action</Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </>
);

const renderAlertDialog = ({
  children,
  ...rest
}: AlertDialogRootPrimitivePropsWithoutRef) => {
  return renderWithProviders(
    <AlertDialog.Root {...rest}>{children}</AlertDialog.Root>,
  );
};

describe("AlertDialog", () => {
  const user = userEvent.setup();

  it("should not have accessibility errors when closed", async () => {
    const { container } = renderAlertDialog({
      children: <DefaultChildren />,
    });
    await axeTest(container);
  });

  it("should not have accessibility errors when open", async () => {
    const { container } = renderAlertDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });
    await axeTest(container);
  });

  it("should not render when closed", () => {
    renderAlertDialog({
      children: <DefaultChildren />,
    });

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("should render when opened", async () => {
    renderAlertDialog({
      children: <DefaultChildren />,
    });

    await user.click(
      screen.getByRole("button", { name: /open alert dialog/i }),
    );

    expect(
      screen.getByRole("alertdialog", { name: /title/i }),
    ).toBeInTheDocument();
  });

  it("should close when action taken", async () => {
    renderAlertDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    await user.click(screen.getByRole("button", { name: /action/i }));

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("should close when cancelled", async () => {
    renderAlertDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });
});
