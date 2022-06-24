import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import DropdownMenu, { MenuButton, MenuItem, MenuList } from ".";

export default {
  component: DropdownMenu,
  title: "Components/Dropdown Menu",
} as Meta;

const menuItems = ["one", "two", "three"];

const TemplateDropdownMenu: Story = () => (
  <DropdownMenu>
    <MenuButton color="primary">Open Menu</MenuButton>
    <MenuList>
      {menuItems.map((item) => (
        <MenuItem key={item} onSelect={() => action(`Select item ${item}`)}>
          Item {item}
        </MenuItem>
      ))}
    </MenuList>
  </DropdownMenu>
);

export const BasicDropdownMenu = TemplateDropdownMenu.bind({});
