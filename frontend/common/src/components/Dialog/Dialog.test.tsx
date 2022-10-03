/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";

import { render, axeTest } from "../../helpers/testUtils";

import Dialog from ".";
import Button from "../Button";

type DialogRootPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
  typeof Dialog.Root
>;
const DefaultChildren = () => (
  <>
    <Dialog.Trigger>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header color="ia-primary" subtitle="Dialog Subtitle">
        Dialog Title
      </Dialog.Header>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam efficitur
        leo a tellus imperdiet, quis imperdiet nulla viverra. Aliquam porttitor
        pellentesque rhoncus.
      </p>
      <Dialog.Footer>
        <Dialog.Close>
          <Button color="cta">Close Action</Button>
        </Dialog.Close>
      </Dialog.Footer>
    </Dialog.Content>
  </>
);

const renderDialog = ({
  children,
  ...rest
}: DialogRootPrimitivePropsWithoutRef) => {
  return render(<Dialog.Root {...rest}>{children}</Dialog.Root>);
};

describe("Dialog", () => {
  it("should not have accessibility errors when closed", async () => {
    const { container } = renderDialog({
      children: <DefaultChildren />,
    });
    await axeTest(container);
  });

  it("should not have accessibility errors when open", async () => {
    const { container } = renderDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });
    await axeTest(container);
  });

  it("should not render when closed", () => {
    renderDialog({
      children: <DefaultChildren />,
    });

    expect(
      screen.queryByRole("dialog", { name: /dialog title/i }),
    ).not.toBeInTheDocument();
  });

  it("should not render when opened", async () => {
    renderDialog({
      children: <DefaultChildren />,
    });

    fireEvent.click(await screen.getByRole("button", { name: /open dialog/i }));

    expect(
      screen.queryByRole("dialog", { name: /dialog title/i }),
    ).toBeInTheDocument();
  });

  it("should close when close action taken", async () => {
    renderDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    fireEvent.click(
      await screen.getByRole("button", { name: /close action/i }),
    );

    expect(
      screen.queryByRole("dialog", { name: /dialog title/i }),
    ).not.toBeInTheDocument();
  });
});
