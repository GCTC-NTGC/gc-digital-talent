import React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import ArrowLeftOnRectangleIcon from "@heroicons/react/24/outline/ArrowLeftOnRectangleIcon";
import ArrowRightStartOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightStartOnRectangleIcon";

import { useApiRoutes, useAuthentication } from "@gc-digital-talent/auth";
import { ExternalSideMenuItem, SideMenuButton } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import SignOutConfirmation from "~/components/SignOutConfirmation/SignOutConfirmation";
import authMessages from "~/messages/authMessages";

const SignInOrSignOut = () => {
  const intl = useIntl();
  const location = useLocation();
  const apiRoutes = useApiRoutes();
  const { loggedIn } = useAuthentication();

  if (loggedIn) {
    return (
      <SignOutConfirmation>
        <SideMenuButton icon={ArrowLeftOnRectangleIcon}>
          {intl.formatMessage(authMessages.signOut)}
        </SideMenuButton>
      </SignOutConfirmation>
    );
  }

  return (
    <ExternalSideMenuItem
      icon={ArrowRightStartOnRectangleIcon}
      href={apiRoutes.login(location.pathname, getLocale(intl))}
    >
      {intl.formatMessage(authMessages.signIn)}
    </ExternalSideMenuItem>
  );
};

export default SignInOrSignOut;
