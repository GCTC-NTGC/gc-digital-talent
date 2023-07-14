import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  AuthorizationContext,
  AuthenticationContext,
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
} from "@gc-digital-talent/auth";
import { RoleAssignment } from "@gc-digital-talent/graphql";

import AdminSideMenu, { AdminSideMenuProps } from "./AdminSideMenu";

export default {
  component: AdminSideMenu,
  title: "Components/Admin Side Menu",
  parameters: {
    themeKey: "admin",
  },
} as Meta<typeof AdminSideMenu>;

interface TemplateProps extends AdminSideMenuProps {
  isLoggedIn: boolean;
  roleAssignments: RoleAssignment[];
}

const Template: StoryFn<TemplateProps> = (args) => {
  const { isLoggedIn, roleAssignments, ...rest } = args;
  const authenticationState = useAuthentication();
  const authorizationState = useAuthorization();
  const mockAuthState = React.useMemo(
    () => ({
      ...authenticationState,
      isLoggedIn,
    }),
    [isLoggedIn, authenticationState],
  );
  const mockAuthorizationState = React.useMemo(
    () => ({
      ...authorizationState,
      roleAssignments,
    }),
    [roleAssignments, authorizationState],
  );

  return (
    <AuthenticationContext.Provider value={mockAuthState}>
      <AuthorizationContext.Provider value={mockAuthorizationState}>
        <AdminSideMenu {...rest} />
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
  roleAssignments: [
    { id: "abc", role: { id: "123", name: ROLE_NAME.PlatformAdmin } },
    { id: "def", role: { id: "456", name: ROLE_NAME.RequestResponder } },
  ],
};

export const LoggedInAndOpen = Template.bind({});
LoggedInAndOpen.args = {
  isOpen: true,
  isLoggedIn: true,
  roleAssignments: [
    { id: "abc", role: { id: "123", name: ROLE_NAME.PlatformAdmin } },
    { id: "def", role: { id: "456", name: ROLE_NAME.RequestResponder } },
  ],
};
