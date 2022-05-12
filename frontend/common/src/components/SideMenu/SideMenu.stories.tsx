import React from "react";
import { Story, Meta } from "@storybook/react";
import { HomeIcon } from "@heroicons/react/outline";

import { LoginIcon } from "@heroicons/react/solid";
import SideMenuComponent from "./SideMenu";
import SideMenuItem from "./SideMenuItem";

import Button from "../Button";

export default {
  component: SideMenuComponent,
  title: "Components/Side Menu",
  args: {
    isOpen: true,
  },
  argTypes: {
    isOpen: {
      name: "Is Open",
      type: { name: "boolean" },
    },
  },
  parameters: {
    layout: "fullscreen",
  },
} as Meta;

const TemplateSideMenu: Story = (args) => {
  const { isOpen: defaultOpen } = args;
  const [isOpen, setOpen] = React.useState<boolean>(defaultOpen);

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  return (
    <div data-h2-display="b(flex)">
      <SideMenuComponent
        isOpen={isOpen}
        onToggle={handleToggle}
        footer={<SideMenuItem icon={LoginIcon}>Login</SideMenuItem>}
      >
        <SideMenuItem icon={HomeIcon} onClick={() => null}>
          Home
        </SideMenuItem>
      </SideMenuComponent>
      <div data-h2-padding="b(all, m)" data-h2-width="b(100)">
        <Button color="primary" mode="solid" onClick={handleToggle}>
          Toggle Menu
        </Button>
      </div>
    </div>
  );
};

export const SideMenu = TemplateSideMenu.bind({});
