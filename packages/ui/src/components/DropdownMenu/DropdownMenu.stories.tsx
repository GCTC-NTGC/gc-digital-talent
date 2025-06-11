import { useState } from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";

import {
  OverlayOrDialogDecorator,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import Button from "../Button";
import DropdownMenu from "./DropdownMenu";

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
  },
} as Meta;

const Check = () => (
  <DropdownMenu.ItemIndicator>
    <CheckIcon />
  </DropdownMenu.ItemIndicator>
);

const Template: StoryFn<typeof DropdownMenu.Root> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [value, setValue] = useState<string>("");
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <Button>Open Dropdown</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Basic Items</DropdownMenu.Label>
        <DropdownMenu.Item>Item One</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Item Two disabled</DropdownMenu.Item>
        <DropdownMenu.Item color="secondary">Secondary</DropdownMenu.Item>
        <DropdownMenu.Item color="success">Success</DropdownMenu.Item>
        <DropdownMenu.Item color="warning">Warning</DropdownMenu.Item>
        <DropdownMenu.Item color="error">Error</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Form Items</DropdownMenu.Label>
        <DropdownMenu.CheckboxItem>
          Basic CheckboxItem
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.RadioGroup value={value} onValueChange={setValue}>
          <DropdownMenu.RadioItem value="one">
            <Check />
            RadioItem One
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="two">
            <Check />
            RadioItem Two
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="three">
            <Check />
            RadioItem Three
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export const Default = Template.bind({});
