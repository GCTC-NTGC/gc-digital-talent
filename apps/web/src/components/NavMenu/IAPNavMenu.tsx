import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import { useAuthentication } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import Menu from "./Menu";
import MenuItem from "./MenuItem";
import HomeLink from "./HomeLink";

const IAPNavMenu = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pathname } = useLocation();
  const { loggedIn } = useAuthentication();
  const searchParams = `?from=${paths.iap()}&personality=iap`;

  const homeLinkProps = {
    href: paths.iap(),
    label: intl.formatMessage(commonMessages.iapTitle),
  };

  return (
    <Menu
      authParams={searchParams}
      homeLink={homeLinkProps}
      accountLinks={
        loggedIn ? (
          <MenuItem
            key="signOut"
            href={paths.loggedOut()}
            title={intl.formatMessage(authMessages.signOut)}
            state={{ from: pathname }}
            className="ml-auto"
          />
        ) : null
      }
    >
      <HomeLink {...homeLinkProps} />
      <MenuItem
        href={paths.iapManager()}
        title={intl.formatMessage({
          defaultMessage: "Hire an IT apprentice",
          id: "39RER8",
          description: "Page title for IAP manager homepage",
        })}
      />
      <MenuItem
        href={paths.home()}
        title={intl.formatMessage(commonMessages.projectTitle)}
        end
      />
    </Menu>
  );
};

export default IAPNavMenu;
