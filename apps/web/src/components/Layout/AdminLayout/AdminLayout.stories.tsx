import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  AuthorizationContext,
  AuthenticationContext,
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
  RoleName,
} from "@gc-digital-talent/auth";

import AdminLayout from "./AdminLayout";

const availableRoles = Object.values(ROLE_NAME);

type AdminLayoutArgs = {
  isLoggedIn: boolean;
  roles: RoleName[];
};

export default {
  component: AdminLayout,
  title: "Components/Layout/Admin Layout",
  args: {
    isLoggedIn: true,
    roles: availableRoles,
  },
  argTypes: {
    roles: {
      control: "check",
      options: availableRoles,
    },
  },
} as Meta<AdminLayoutArgs>;

const Template: StoryFn<AdminLayoutArgs> = (args) => {
  const { isLoggedIn, roles } = args;
  const authenticationState = useAuthentication();
  const authorizationState = useAuthorization();

  const mockAuthenticationState = React.useMemo(
    () => ({
      ...authenticationState,
      isLoggedIn,
    }),
    [isLoggedIn, authenticationState],
  );
  const mockAuthorizationState = React.useMemo(
    () => ({
      ...authorizationState,
      roleAssignments: roles.map((roleName) => ({
        id: faker.string.uuid(),
        role: {
          id: faker.string.uuid(),
          name: roleName,
        },
      })),
    }),
    [roles, authorizationState],
  );

  return (
    <AuthenticationContext.Provider value={mockAuthenticationState}>
      <AuthorizationContext.Provider value={mockAuthorizationState}>
        <AdminLayout />
      </AuthorizationContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  isLoggedIn: true,
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {
  isLoggedIn: false,
  roles: [],
};
