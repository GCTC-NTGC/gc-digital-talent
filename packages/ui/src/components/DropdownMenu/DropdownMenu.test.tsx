/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { act, fireEvent, screen } from "@testing-library/react";
import React from "react";

import { renderWithProviders, axeTest } from "@gc-digital-talent/jest-helpers";

import DropdownMenu from ".";
import Button from "../Button";

type DropdownMenuRootPrimitivePropsWithoutRef = React.ComponentPropsWithoutRef<
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
  const [value, setValue] = React.useState<string>("");

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
  window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    }));

  it("should not have accessibility errors when closed", async () => {
    await act(async () => {
      const { container } = renderDropdownMenu({});
      await axeTest(container);
    });
  });

  it("should not have accessibility errors when open", async () => {
    await act(async () => {
      const { container } = renderDropdownMenu({
        defaultOpen: true,
      });
      await axeTest(container);
    });
  });

  it("should not render when closed", async () => {
    await act(() => {
      renderDropdownMenu({});
    });

    expect(
      screen.queryByRole("menu", { name: /dropdown menu/i }),
    ).not.toBeInTheDocument();
  });

  it("should render when opened", async () => {
    await act(() => {
      renderDropdownMenu({
        defaultOpen: true,
      });
    });

    expect(
      screen.queryByRole("menu", { name: /dropdown menu/i }),
    ).toBeInTheDocument();
  });

  it("change value when selected", async () => {
    await act(() => {
      renderDropdownMenu({
        defaultOpen: true,
      });
    });

    const radioItemTwo = await screen.findByRole("menuitemradio", {
      name: /two/i,
    });

    fireEvent.click(radioItemTwo);

    expect(radioItemTwo).toHaveAttribute("data-state", "checked");
  });
});
