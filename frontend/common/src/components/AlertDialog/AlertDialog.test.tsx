/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";

import { render, axeTest } from "../../helpers/testUtils";

import AlertDialog from ".";
import Button from "../Button";

type AlertDialogRootPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
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
          <Button color="cta">Action</Button>
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </>
);

const renderAlertDialog = ({
  children,
  ...rest
}: AlertDialogRootPrimitivePropsWithoutRef) => {
  return render(<AlertDialog.Root {...rest}>{children}</AlertDialog.Root>);
};

describe("AlertDialog", () => {
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

    fireEvent.click(
      await screen.getByRole("button", { name: /open alert dialog/i }),
    );

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).toBeInTheDocument();
  });

  it("should close when action taken", async () => {
    renderAlertDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    fireEvent.click(await screen.getByRole("button", { name: /action/i }));

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });

  it("should close when cancelled", async () => {
    renderAlertDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    fireEvent.click(await screen.getByRole("button", { name: /cancel/i }));

    expect(
      screen.queryByRole("alertdialog", { name: /title/i }),
    ).not.toBeInTheDocument();
  });
});
