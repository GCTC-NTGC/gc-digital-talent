import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { LogoutIcon, LoginIcon } from "@heroicons/react/outline";
import Dialog from "@common/components/Dialog";
import { SideMenuItem } from "@common/components/SideMenu";
import { useLocation } from "@common/helpers/router";
import { getLocale } from "@common/helpers/localize";

import { AuthenticationContext } from "@common/components/Auth";
import { useApiRoutes } from "@common/hooks/useApiRoutes";
import { Button } from "@common/components";

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
        icon={loggedIn ? LogoutIcon : LoginIcon}
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
              description: "Label displayed on the Logout menu item.",
            })
          : intl.formatMessage({
              defaultMessage: "Login",
              description: "Label displayed on the Login menu item.",
            })}
      </SideMenuItem>
      {loggedIn && (
        <Dialog
          confirmation
          centered
          isOpen={isConfirmationOpen}
          onDismiss={() => {
            setConfirmationOpen(false);
          }}
          title={intl.formatMessage({
            defaultMessage: "Logout",
            description:
              "Title for the modal that appears when an authenticated user lands on /logged-out.",
          })}
          footer={
            <div
              data-h2-display="b(flex)"
              data-h2-align-items="b(center)"
              data-h2-justify-content="b(flex-end)"
            >
              <Button
                mode="outline"
                color="primary"
                type="button"
                onClick={() => {
                  setConfirmationOpen(false);
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Cancel",
                  description: "Link text to cancel logging out.",
                })}
              </Button>
              <span data-h2-margin="b(left, s)">
                <Button
                  mode="solid"
                  color="primary"
                  type="button"
                  onClick={() => {
                    logout();
                  }}
                >
                  {intl.formatMessage({
                    defaultMessage: "Logout",
                    description: "Link text to logout.",
                  })}
                </Button>
              </span>
            </div>
          }
        >
          <p data-h2-font-size="b(h5)">
            {intl.formatMessage({
              defaultMessage: "Are you sure you would like to logout?",
              description:
                "Question displayed when authenticated user lands on /logged-out.",
            })}
          </p>
        </Dialog>
      )}
    </>
  );
};

export default LoginOrLogout;
