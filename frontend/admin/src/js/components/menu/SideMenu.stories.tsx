import React from "react";
import { Story } from "@storybook/react";

import {
  AuthenticationContext,
  AuthorizationContext,
  defaultAuthState,
} from "@common/components/Auth";
import SideMenu, { AdminSideMenuProps } from "./AdminSideMenu";
import { Role } from "../../api/generated";

export default {
  component: SideMenu,
  title: "Components/Admin Side Menu",
};

interface TemplateProps extends AdminSideMenuProps {
  isLoggedIn: boolean;
}

const Template: Story<TemplateProps> = (args) => {
  const { isLoggedIn, ...rest } = args;
  const mockAuthState = React.useMemo(
    () => ({
      ...defaultAuthState,
      loggedIn: isLoggedIn,
    }),
    [isLoggedIn],
  );
  const mockAuthorizationState = React.useMemo(
    () => ({
      ...AuthorizationContext,
      loggedInUserRoles: isLoggedIn ? [Role.Admin] : null,
    }),
    [isLoggedIn],
  );

  return (
    <AuthenticationContext.Provider value={mockAuthState}>
      <AuthorizationContext.Provider value={mockAuthorizationState}>
        <SideMenu {...rest} />
      </AuthorizationContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const LoggedOutAndClosed = Template.bind({});
LoggedOutAndClosed.args = {
  isOpen: false,
  isLoggedIn: false,
};

export const LoggedOutAndOpen = Template.bind({});
LoggedOutAndOpen.args = {
  isOpen: true,
  isLoggedIn: false,
};

export const LoggedInAndClosed = Template.bind({});
LoggedInAndClosed.args = {
  isOpen: false,
  isLoggedIn: true,
};

export const LoggedInAndOpen = Template.bind({});
LoggedInAndOpen.args = {
  isOpen: true,
  isLoggedIn: true,
};
