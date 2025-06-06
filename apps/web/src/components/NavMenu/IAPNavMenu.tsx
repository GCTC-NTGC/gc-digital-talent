import { useIntl } from "react-intl";

import { MenuLink } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Maybe, SillyName } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";
import NavMenu from "./NavMenu";

interface IAPNavMenuProps {
  loggedIn?: boolean;
  userAuthInfo?: Maybe<SillyName>;
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
        <MenuLink key="iap-home" to={paths.iap()} end>
          {intl.formatMessage(commonMessages.iapTitle)}
        </MenuLink>,
        <MenuLink key="iap-manager-home" to={paths.iapManager()}>
          {intl.formatMessage({
            defaultMessage: "Hire an IT apprentice",
            id: "39RER8",
            description: "Page title for IAP manager homepage",
          })}
        </MenuLink>,
        <MenuLink key="home" to={paths.home()} end>
          {intl.formatMessage(commonMessages.projectTitle)}
        </MenuLink>,
      ]}
    />
  );
};

export default IAPNavMenu;
