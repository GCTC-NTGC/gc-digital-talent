/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { faker } from "@faker-js/faker/locale/en";
import { ComponentPropsWithoutRef } from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Button from "../Button";
import Dialog from "./Dialog";

type DialogRootPrimitivePropsWithoutRef = ComponentPropsWithoutRef<
  typeof Dialog.Root
>;
const DefaultChildren = () => (
  <>
    <Dialog.Trigger>
      <Button>Open Dialog</Button>
    </Dialog.Trigger>
    <Dialog.Content hasSubtitle>
      <Dialog.Header subtitle="Dialog Subtitle">Dialog Title</Dialog.Header>
      <Dialog.Body>
        <p>{faker.lorem.sentences(3)}</p>
        <Dialog.Footer>
          <Dialog.Close>
            <Button color="tertiary">Close Action</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Body>
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
  const user = userEvent.setup();

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

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    expect(
      screen.getByRole("dialog", { name: /dialog title/i }),
    ).toBeInTheDocument();
  });

  it("should close when close action taken", async () => {
    renderDialog({
      children: <DefaultChildren />,
      defaultOpen: true,
    });

    await user.click(screen.getByRole("button", { name: /close action/i }));

    expect(
      screen.queryByRole("dialog", { name: /dialog title/i }),
    ).not.toBeInTheDocument();
  });

  it("should work with an IconButton", async () => {
    renderDialog({
      children: (
        <>
          <Dialog.Trigger>
            <Button icon={PlusIcon}>Open Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content hasSubtitle>
            <Dialog.Header subtitle="Dialog Subtitle">
              Dialog Title
            </Dialog.Header>
            <p>{faker.lorem.sentences(3)}</p>
            <Dialog.Footer>
              <Dialog.Close>
                <Button color="tertiary">Close Action</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </>
      ),
    });

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    expect(
      screen.getByRole("dialog", { name: /dialog title/i }),
    ).toBeInTheDocument();
  });
});
