/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentPropsWithoutRef, useState } from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import Button from "../Button";
import DropdownMenu from "./DropdownMenu";

type DropdownMenuRootPrimitivePropsWithoutRef = ComponentPropsWithoutRef<
  typeof DropdownMenu.Root
>;

interface ChildProps {
  onValueChange: (value: string) => void;
  value: string;
}

const DefaultChildren = ({ onValueChange, value }: ChildProps) => (
  <>
    <DropdownMenu.Trigger>
      <Button>Dropdown Menu</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Label>Dropdown Items Label</DropdownMenu.Label>
      <DropdownMenu.Item>Item One</DropdownMenu.Item>
      <DropdownMenu.Item>Item Two</DropdownMenu.Item>
      <DropdownMenu.Separator />

      <DropdownMenu.Label>Dropdown Checkbox Label</DropdownMenu.Label>
      <DropdownMenu.CheckboxItem>Checkbox Item One</DropdownMenu.CheckboxItem>
      <DropdownMenu.Separator />

      <DropdownMenu.Label>Dropdown Checkbox Label</DropdownMenu.Label>
      <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
        <DropdownMenu.RadioItem value="one">
          Radio Item One
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="two">
          Radio Item Two
        </DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="three">
          Radio Item Three
        </DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </>
);

const StatefulDropdownMenu = (
  props: DropdownMenuRootPrimitivePropsWithoutRef,
) => {
  const [value, setValue] = useState<string>("");

  return (
    <DropdownMenu.Root {...props}>
      <DefaultChildren onValueChange={setValue} value={value} />
    </DropdownMenu.Root>
  );
};

const renderDropdownMenu = (
  props: DropdownMenuRootPrimitivePropsWithoutRef,
) => {
  return renderWithProviders(<StatefulDropdownMenu {...props} />);
};

describe("DropdownMenu", () => {
  const user = userEvent.setup();

  window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

  it("should not have accessibility errors when closed", async () => {
    const { container } = renderDropdownMenu({});

    await axeTest(container);
  });

  it("should not have accessibility errors when open", async () => {
    const { container } = renderDropdownMenu({});
    await act(async () => {
      await user.click(screen.getByRole("button", { name: /dropdown menu/i }));
    });

    await axeTest(container);
  });

  it("should not render when closed", () => {
    renderDropdownMenu({});

    expect(
      screen.queryByRole("menu", { name: /dropdown menu/i }),
    ).not.toBeInTheDocument();
  });

  it("should render when opened", async () => {
    renderDropdownMenu({});

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /dropdown menu/i }));
    });

    expect(
      screen.getByRole("menu", { name: /dropdown menu/i }),
    ).toBeInTheDocument();
  });

  it("change value when selected", async () => {
    renderDropdownMenu({});

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /dropdown menu/i }));
    });

    const radioItemTwo = await screen.findByRole("menuitemradio", {
      name: /two/i,
    });

    await user.click(radioItemTwo);

    expect(radioItemTwo).toHaveAttribute("data-state", "checked");
  });
});
