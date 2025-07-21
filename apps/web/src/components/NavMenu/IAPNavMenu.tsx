import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import { NavMenu } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import Menu from "./Menu";
import MenuItem from "./MenuItem";

const IAPNavMenu = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { pathname } = useLocation();
  const searchParams = `?from=${paths.iap()}&personality=iap`;

  return (
    <Menu
      authParams={searchParams}
      accountLinks={
        <MenuItem
          key="signOut"
          href={paths.loggedOut()}
          title={intl.formatMessage(authMessages.signOut)}
          state={{ from: pathname }}
        />
      }
      homeLink={{
        href: paths.iap(),
        label: intl.formatMessage(commonMessages.iapTitle),
      }}
    >
      <NavMenu.List type="main">
        <NavMenu.Item>
          <NavMenu.Link type="link" href={paths.iap()} end>
            {intl.formatMessage(commonMessages.iapTitle)}
          </NavMenu.Link>
        </NavMenu.Item>
        <NavMenu.Item>
          <NavMenu.Link type="link" href={paths.iapManager()}>
            {intl.formatMessage({
              defaultMessage: "Hire an IT apprentice",
              id: "39RER8",
              description: "Page title for IAP manager homepage",
            })}
          </NavMenu.Link>
        </NavMenu.Item>
        <NavMenu.Item>
          <NavMenu.Link type="link" href={paths.home()} end>
            {intl.formatMessage(commonMessages.projectTitle)}
          </NavMenu.Link>
        </NavMenu.Item>
      </NavMenu.List>
    </Menu>
  );
};

export default IAPNavMenu;
