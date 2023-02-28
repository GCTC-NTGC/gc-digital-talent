/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { faker } from "@faker-js/faker";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Dialog from ".";
import Button, { IconButton } from "../Button";

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
      <p>{faker.lorem.sentences(3)}</p>
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
  return renderWithProviders(<Dialog.Root {...rest}>{children}</Dialog.Root>);
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

  it("should render when opened", async () => {
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

  it("should work with an IconButton", async () => {
    renderDialog({
      children: (
        <>
          <Dialog.Trigger>
            <IconButton icon={PlusIcon}>Open Dialog</IconButton>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header color="ia-primary" subtitle="Dialog Subtitle">
              Dialog Title
            </Dialog.Header>
            <p>{faker.lorem.sentences(3)}</p>
            <Dialog.Footer>
              <Dialog.Close>
                <Button color="cta">Close Action</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </>
      ),
    });

    fireEvent.click(await screen.getByRole("button", { name: /open dialog/i }));

    expect(
      screen.queryByRole("dialog", { name: /dialog title/i }),
    ).toBeInTheDocument();
  });
});
