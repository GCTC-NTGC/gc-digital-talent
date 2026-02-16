import { useState } from "react";
import EllipsisVerticalIcon from "@heroicons/react/16/solid/EllipsisVerticalIcon";
import type { StoryFn, Meta } from "@storybook/react-vite";

import {
  GLOBAL_A11Y_EXCLUDES,
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import DropdownMenu from "./DropdownMenu";
import IconButton from "../Button/IconButton";

export default {
  component: DropdownMenu.Root,
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
    a11y: {
      context: {
        exclude: [
          ...GLOBAL_A11Y_EXCLUDES,
          // Issue: https://github.com/radix-ui/primitives/issues/3085
          "[data-aria-hidden]",
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn<typeof DropdownMenu.Root> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>Open Menu</DropdownMenu.Trigger>
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
          <DropdownMenu.RadioGroup>
            <DropdownMenu.RadioItem value="one">
              Radio one
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="two">
              Radio two
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="three">
              Radio three
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Group>
      </DropdownMenu.Popup>
    </DropdownMenu.Root>
  );
};

export const Default = Template.bind({});
