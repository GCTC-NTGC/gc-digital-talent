import React from "react";
import { useIntl } from "react-intl";

import { MenuLink } from "@gc-digital-talent/ui";
import { Maybe, User } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

import NavMenu from "./NavMenu";
import LogoutConfirmation from "../LogoutConfirmation";
import { LogoutButton } from "../Layout/Layout";

interface IAPNavMenuProps {
  loggedIn?: boolean;
  user?: Maybe<User>;
}

const IAPNavMenu = ({ loggedIn, user }: IAPNavMenuProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  let authLinks = [
    <MenuLink key="login-info" to={`${paths.login()}?iap`}>
      {intl.formatMessage({
        defaultMessage: "Login",
        id: "md7Klw",
        description: "Label displayed on the login link menu item.",
      })}
    </MenuLink>,
    <MenuLink key="register" to={`${paths.register()}?iap`}>
      {intl.formatMessage({
        defaultMessage: "Register",
        id: "LMGaDQ",
        description: "Label displayed on the register link menu item.",
      })}
    </MenuLink>,
  ];

  if (loggedIn && user) {
    authLinks = [
      <LogoutConfirmation key="logout">
        <LogoutButton>
          {intl.formatMessage({
            defaultMessage: "Logout",
            id: "3vDhoc",
            description: "Label displayed on the logout link menu item.",
          })}
        </LogoutButton>
      </LogoutConfirmation>,
    ];
  }

  return (
    <NavMenu
      utilityItems={authLinks}
      mainItems={[
        <MenuLink key="home" to={paths.iap()}>
          {intl.formatMessage({
            defaultMessage: "IT Apprenticeship Program for Indigenous Peoples",
            id: "k4Vsh0",
            description:
              "Link to the homepage for IT Apprenticeship Program for Indigenous Peoples.",
          })}
        </MenuLink>,
        <MenuLink key="home" to={paths.home()} end>
          {intl.formatMessage({
            defaultMessage: "GC Digital Talent",
            id: "hfI9v3",
            description: "Link to the homepage for GC Digital Talent.",
          })}
        </MenuLink>,
      ]}
    />
  );
};

export default IAPNavMenu;
