import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { ComponentPropsWithoutRef, useState } from "react";

import {
  renderWithProviders,
  expectNoAccessibilityErrors,
} from "@gc-digital-talent/vitest-helpers";

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
    <DropdownMenu.Trigger>Dropdown Menu</DropdownMenu.Trigger>
    <DropdownMenu.Popup>
      <DropdownMenu.Item>Item One</DropdownMenu.Item>
      <DropdownMenu.Item disabled>Item Two disabled</DropdownMenu.Item>
      <DropdownMenu.Item color="secondary">Secondary</DropdownMenu.Item>
      <DropdownMenu.Item color="success">Success</DropdownMenu.Item>
      <DropdownMenu.Item color="warning">Warning</DropdownMenu.Item>
      <DropdownMenu.Item color="error">Error</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.GroupLabel>Checkboxes</DropdownMenu.GroupLabel>
        <DropdownMenu.CheckboxItem>Checkbox one</DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem>Checkbox two</DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem>Checkbox three</DropdownMenu.CheckboxItem>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.GroupLabel>Radios</DropdownMenu.GroupLabel>
        <DropdownMenu.RadioGroup value={value} onValueChange={onValueChange}>
          <DropdownMenu.RadioItem value="one">Radio one</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="two">Radio two</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="three">
            Radio three
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Group>
    </DropdownMenu.Popup>
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

  it("should not have accessibility errors when closed", async () => {
    const { container } = renderDropdownMenu({});

    await expectNoAccessibilityErrors(container);
  });

  it("should not have accessibility errors when open", async () => {
    const { container } = renderDropdownMenu({});
    await user.click(screen.getByRole("button", { name: /dropdown menu/i }));

    await expectNoAccessibilityErrors(container);
  });

  it("change value when selected", async () => {
    renderDropdownMenu({});

    await user.click(screen.getByRole("button", { name: /dropdown menu/i }));

    const radioItemTwo = await screen.findByRole("menuitemradio", {
      name: /two/i,
    });

    await user.click(radioItemTwo);

    expect(radioItemTwo).toHaveAttribute("aria-checked", "true");
  });
});
