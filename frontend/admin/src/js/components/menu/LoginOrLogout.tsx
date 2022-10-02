import React from "react";
import { useIntl } from "react-intl";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LogoutConfirmation from "@common/components/LogoutConfirmation";
import { SideMenuItem, SideMenuButton } from "@common/components/SideMenu";
import { useLocation } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";

import { useApiRoutes } from "@common/hooks/useApiRoutes";
import useAuth from "@common/hooks/useAuth";

const LoginOrLogout = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn } = useAuth();

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
    <SideMenuItem
      icon={ArrowRightOnRectangleIcon}
      href={apiRoutes.login(location.pathname, getLocale(intl))}
    >
      {intl.formatMessage({
        defaultMessage: "Login",
        id: "71ID2W",
        description: "Label displayed on the Login menu item.",
      })}
    </SideMenuItem>
  );
};

export default LoginOrLogout;
