import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";

import { useApiRoutes, useAuthentication } from "@gc-digital-talent/auth";
import { ExternalSideMenuItem, SideMenuButton } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import LogoutConfirmation from "~/components/LogoutConfirmation";
import authMessages from "~/messages/authMessages";

const LoginOrLogout = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn } = useAuthentication();

  if (loggedIn) {
    return (
      <LogoutConfirmation>
        <SideMenuButton icon={ArrowLeftOnRectangleIcon}>
          {intl.formatMessage(authMessages.signOut)}
        </SideMenuButton>
      </LogoutConfirmation>
    );
  }

  return (
    <ExternalSideMenuItem
      icon={ArrowRightOnRectangleIcon}
      href={apiRoutes.login(location.pathname, getLocale(intl))}
    >
      {intl.formatMessage(authMessages.signIn)}
    </ExternalSideMenuItem>
  );
};

export default LoginOrLogout;
