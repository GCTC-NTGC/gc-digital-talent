import React from "react";
import { Story } from "@storybook/react";

import SideMenu, { SideMenuProps } from "./SideMenu";
import AuthorizationContainer, { AuthorizationContext } from "../AuthorizationContainer";
import AuthContainer, { AuthContext, DefaultAuthState } from "../AuthContainer";
import { useAdminRoutes } from "../../adminRoutes";
import { Role } from "../../api/generated";

export default {
  component: SideMenu,
  title: "Components/Admin Side Menu",
}

interface TemplateProps extends SideMenuProps {
  isLoggedIn: boolean;
}

const Template: Story<TemplateProps> = args => {
  const { isLoggedIn, ...rest } = args;
  const mockAuthState = {
    ...DefaultAuthState,
    loggedIn: isLoggedIn,
  }
  const mockAuthorizationState = {
    ...AuthorizationContext,
    loggedInUserRoles: isLoggedIn ? [Role.Admin] : null,
  }

  return(
    <AuthContext.Provider value={mockAuthState}>
      <AuthorizationContext.Provider value={mockAuthorizationState}>
        <SideMenu {...rest} />
      </AuthorizationContext.Provider>
    </AuthContext.Provider>
  )
}

export const LoggedOutAndClosed = Template.bind({})
LoggedOutAndClosed.args = {
  isOpen: false,
  isLoggedIn: false,
}

export const LoggedOutAndOpen = Template.bind({})
LoggedOutAndOpen.args = {
  isOpen: true,
  isLoggedIn: false,
}

export const LoggedInAndClosed = Template.bind({})
LoggedInAndClosed.args = {
  isOpen: false,
  isLoggedIn: true,
}

export const LoggedInAndOpen = Template.bind({})
LoggedInAndOpen.args = {
  isOpen: true,
  isLoggedIn: true,
}
