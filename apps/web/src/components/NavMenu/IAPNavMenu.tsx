import React from "react";
import { useIntl } from "react-intl";

import { MenuLink } from "@gc-digital-talent/ui";

import { Maybe, UserAuthInfo } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";
import NavMenu from "./NavMenu";

interface IAPNavMenuProps {
  loggedIn?: boolean;
  userAuthInfo?: Maybe<UserAuthInfo>;
}

const IAPNavMenu = ({ loggedIn, userAuthInfo }: IAPNavMenuProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const searchParams = `?from=${paths.iap()}&personality=iap`;

  let authLinks = [
    <MenuLink key="sign-in" to={`${paths.login()}${searchParams}`}>
      {intl.formatMessage(authMessages.signIn)}
    </MenuLink>,
    <MenuLink key="sign-up" to={`${paths.register()}${searchParams}`}>
      {intl.formatMessage(authMessages.signUp)}
    </MenuLink>,
  ];

  if (loggedIn && userAuthInfo) {
    authLinks = [
      <SignOutConfirmation key="sign-out">
        <LogoutButton>{intl.formatMessage(authMessages.signOut)}</LogoutButton>
      </SignOutConfirmation>,
    ];
  }

  return (
    <NavMenu
      utilityItems={authLinks}
      mainItems={[
        <MenuLink key="iap-home" to={paths.iap()}>
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
