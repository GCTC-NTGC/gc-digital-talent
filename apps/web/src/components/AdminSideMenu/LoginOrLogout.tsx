import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { useApiRoutes, useAuthentication } from "@gc-digital-talent/auth";
import { ExternalSideMenuItem, SideMenuButton } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import LogoutConfirmation from "~/components/LogoutConfirmation";

const LoginOrLogout = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn } = useAuthentication();

  if (loggedIn) {
    return (
      <LogoutConfirmation>
        <SideMenuButton icon={ArrowLeftOnRectangleIcon}>
          {intl.formatMessage({
            defaultMessage: "Logout",
            id: "TGV2F7",
            description: "Label displayed on the Logout menu item.",
          })}
        </SideMenuButton>
      </LogoutConfirmation>
    );
  }

  return (
    <ExternalSideMenuItem
      icon={ArrowRightOnRectangleIcon}
      href={apiRoutes.login(location.pathname, getLocale(intl))}
    >
      {intl.formatMessage({
        defaultMessage: "Login",
        id: "71ID2W",
        description: "Label displayed on the Login menu item.",
      })}
    </ExternalSideMenuItem>
  );
};

export default LoginOrLogout;
