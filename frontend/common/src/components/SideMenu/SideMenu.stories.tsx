import React from "react";
import { Story, Meta } from "@storybook/react";
import { HomeIcon } from "@heroicons/react/24/outline";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
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
    <div data-h2-display="base(flex)">
      <SideMenuComponent
        label="Test Menu"
        isOpen={isOpen}
        onToggle={handleToggle}
        footer={
          <SideMenuItem as="button" icon={ArrowRightOnRectangleIcon}>
            Login
          </SideMenuItem>
        }
      >
        <SideMenuItem as="button" icon={HomeIcon} onClick={() => null}>
          Home
        </SideMenuItem>
      </SideMenuComponent>
      <div data-h2-padding="base(x1)" data-h2-width="base(100%)">
        <Button color="primary" mode="solid" onClick={handleToggle}>
          Toggle Menu
        </Button>
      </div>
    </div>
  );
};

export const SideMenu = TemplateSideMenu.bind({});
