import React from "react";
import type { StoryFn } from "@storybook/react";
import CheckIcon from "@heroicons/react/24/solid/CheckIcon";

import Button from "../Button";

import DropdownMenuDocs from "./DropdownMenu.docs.mdx";
import DropdownMenu from "./DropdownMenu";

export default {
  component: DropdownMenu.Root,
  title: "Components/Dropdown Menu",
  parameters: {
    docs: {
      page: DropdownMenuDocs,
    },
  },
};

const Check = () => (
  <DropdownMenu.ItemIndicator>
    <CheckIcon />
  </DropdownMenu.ItemIndicator>
);

const Template: StoryFn<typeof DropdownMenu.Root> = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const [value, setValue] = React.useState<string>("");
  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger>
        <Button>Open Dropdown</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Basic Items</DropdownMenu.Label>
        <DropdownMenu.Item>Item One</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Item Two</DropdownMenu.Item>
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
