import React from "react";
import { Story, Meta } from "@storybook/react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/solid/ArrowRightOnRectangleIcon";

import SideMenuComponent from "./SideMenu";
import { SideMenuButton } from "./SideMenuItem";

import Button from "../Button";
import SideMenuContentWrapper from "./SideMenuContentWrapper";

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
    themeKey: "admin",
  },
} as Meta;

const TemplateSideMenu: Story = (args) => {
  const { isOpen: defaultOpen } = args;
  const [isOpen, setOpen] = React.useState<boolean>(defaultOpen);

  const handleToggle = () => {
    setOpen(!isOpen);
  };

  return (
    <div data-h2-flex-grid="base(stretch, x1)">
      <SideMenuComponent
        label="Test Menu"
        open={isOpen}
        onOpenChange={setOpen}
        footer={
          <SideMenuButton icon={ArrowRightOnRectangleIcon}>
            Login
          </SideMenuButton>
        }
      >
        <SideMenuButton icon={HomeIcon} onClick={() => null}>
          Home
        </SideMenuButton>
      </SideMenuComponent>
      <SideMenuContentWrapper>
        <Button color="primary" mode="solid" onClick={handleToggle}>
          Toggle Menu
        </Button>
      </SideMenuContentWrapper>
    </div>
  );
};

export const SideMenu = TemplateSideMenu.bind({});
