import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { LogoutIcon, LoginIcon } from "@heroicons/react/outline";
import { SideMenuItem } from "@common/components/SideMenu";
import { useLocation } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";

import { AuthenticationContext } from "@common/components/Auth";
import { useApiRoutes } from "../../apiRoutes";

const LoginOrLogout = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn, logout } = useContext(AuthenticationContext);

  return (
    <SideMenuItem
      icon={loggedIn ? LogoutIcon : LoginIcon}
      href={
        !loggedIn
          ? apiRoutes.login(location.pathname, getLocale(intl))
          : undefined
      }
      as={loggedIn ? "button" : "a"}
      onClick={() => {
        if (loggedIn) {
          // Display a confirmation dialog before logging the user out
          // At some point we may change this to use a modal
          const message = intl.formatMessage({
            defaultMessage: "Are you sure you want to logout?",
            description: "Label displayed on the Logout confirmation dialog.",
          });

          // eslint-disable-next-line no-restricted-globals, no-alert
          if (confirm(message)) {
            logout();
          }
        } else {
          window.location.href = apiRoutes.login(
            location.pathname,
            getLocale(intl),
          );
        }
      }}
    >
      {loggedIn
        ? intl.formatMessage({
            defaultMessage: "Logout",
            description: "Label displayed on the Logout menu item.",
          })
        : intl.formatMessage({
            defaultMessage: "Login",
            description: "Label displayed on the Login menu item.",
          })}
    </SideMenuItem>
  );
};

export default LoginOrLogout;
