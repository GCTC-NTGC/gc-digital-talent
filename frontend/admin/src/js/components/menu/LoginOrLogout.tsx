import React, { useContext } from "react";
import { useIntl } from "react-intl";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import LogoutConfirmation from "@common/components/LogoutConfirmation";
import { SideMenuItem } from "@common/components/SideMenu";
import { useLocation } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";

import { AuthenticationContext } from "@common/components/Auth";
import { useApiRoutes } from "@common/hooks/useApiRoutes";

const LoginOrLogout = () => {
  const [isConfirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn, logout } = useContext(AuthenticationContext);

  return (
    <>
      <SideMenuItem
        icon={loggedIn ? ArrowLeftOnRectangleIcon : ArrowRightOnRectangleIcon}
        href={
          !loggedIn
            ? apiRoutes.login(location.pathname, getLocale(intl))
            : undefined
        }
        as={loggedIn ? "button" : "a"}
        onClick={() => {
          if (loggedIn) {
            setConfirmationOpen(true);
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
              id: "TGV2F7",
              description: "Label displayed on the Logout menu item.",
            })
          : intl.formatMessage({
              defaultMessage: "Login",
              id: "71ID2W",
              description: "Label displayed on the Login menu item.",
            })}
      </SideMenuItem>
      {loggedIn && (
        <LogoutConfirmation
          isOpen={isConfirmationOpen}
          onDismiss={() => setConfirmationOpen(false)}
          onLogout={() => logout()}
        />
      )}
    </>
  );
};

export default LoginOrLogout;
