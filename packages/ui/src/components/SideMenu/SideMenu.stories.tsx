import React from "react";
import { Story, Meta } from "@storybook/react";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import SquaresPlusIcon from "@heroicons/react/24/outline/SquaresPlusIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/solid/ArrowLeftOnRectangleIcon";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import Button from "../Button";
import SideMenuComponent from "./SideMenu";
import SideMenuItem, {
  SideMenuButton,
  ExternalSideMenuItem,
} from "./SideMenuItem";
import SideMenuContentWrapper from "./SideMenuContentWrapper";
import SideMenuCategory from "./SideMenuCategory";

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
  const intl = useIntl();
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
          <SideMenuButton icon={ArrowLeftOnRectangleIcon}>
            Sign out
          </SideMenuButton>
        }
      >
        <SideMenuButton icon={XMarkIcon} onClick={handleToggle}>
          {isOpen
            ? intl.formatMessage(uiMessages.closeMenu)
            : intl.formatMessage(uiMessages.openMenu)}
        </SideMenuButton>
        <SideMenuItem icon={HomeIcon} onClick={() => null}>
          Dashboard
        </SideMenuItem>
        <SideMenuCategory title="Recruitment">
          <ExternalSideMenuItem icon={IdentificationIcon}>
            CandidateSearch
          </ExternalSideMenuItem>
          <SideMenuButton icon={SquaresPlusIcon}>Processes</SideMenuButton>
          <SideMenuButton icon={UsersIcon}>Teams</SideMenuButton>
        </SideMenuCategory>
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
