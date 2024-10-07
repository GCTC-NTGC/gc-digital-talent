import { useIntl } from "react-intl";
import { ReactElement, ReactNode } from "react";

import { MenuLink } from "@gc-digital-talent/ui";
import {
  hasRole,
  ROLE_NAME,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import authMessages from "~/messages/authMessages";

import SignOutConfirmation from "../SignOutConfirmation/SignOutConfirmation";
import LogoutButton from "../Layout/LogoutButton";
import NotificationDialog from "../NotificationDialog/NotificationDialog";

interface NavMenuProps {
  mainItems: ReactElement[];
  utilityItems?: ReactElement[];
}

const ListItem = ({ children }: { children?: ReactNode }) => (
  <li data-h2-flex-item="base(content)">
    <span
      data-h2-display="base(block)"
      data-h2-margin="base(0, 0, x.5, 0) p-tablet(0)"
    >
      {children}
    </span>
  </li>
);

const NavMenuComponent = ({ mainItems, utilityItems }: NavMenuProps) => {
  const intl = useIntl();
  const { loggedIn } = useAuthentication();
  return (
    <div
      data-h2-background-color="base:all(black)"
      data-h2-border-bottom="base(1px solid black.20)"
      data-h2-padding="base(x1, 0)"
      data-h2-z-index="base(3)"
    >
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
        >
          <div data-h2-flex-grow="base(1)">
            <nav
              aria-label={intl.formatMessage({
                defaultMessage: "Main menu",
                id: "SY1LIh",
                description: "Label for the main navigation",
              })}
            >
              <ul
                data-h2-list-style="base(none)"
                data-h2-flex-grid="base(flex-start, x1, 0)"
                data-h2-justify-content="base(center) p-tablet(flex-start)"
                data-h2-padding="base(0, 0, 0, 0)"
              >
                {mainItems.map((item) => (
                  <ListItem key={item.key}>{item}</ListItem>
                ))}
              </ul>
            </nav>
          </div>
          {utilityItems && utilityItems.length > 0 ? (
            <>
              <div data-h2-flex-grow="base(2)" data-h2-min-width="base(x3)" />
              <div data-h2-flex-grow="base(1)">
                <nav
                  aria-label={intl.formatMessage({
                    defaultMessage: "Account menu",
                    id: "LIhwJ+",
                    description: "Label for the user account navigation menu",
                  })}
                >
                  <ul
                    data-h2-list-style="base(none)"
                    data-h2-flex-grid="base(flex-start, x1, 0)"
                    data-h2-justify-content="base(center) p-tablet(flex-end)"
                    data-h2-padding="base(0, 0, 0, 0)"
                  >
                    {utilityItems.map((item) => (
                      <ListItem key={item.key}>{item}</ListItem>
                    ))}
                    {loggedIn && (
                      <ListItem>
                        <NotificationDialog />
                      </ListItem>
                    )}
                  </ul>
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const NavigationMenu = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  let menuItems = [
    <MenuLink key="home" to={paths.home()} end>
      {intl.formatMessage(navigationMessages.home)}
    </MenuLink>,
    <MenuLink key="search" to={paths.search()}>
      {intl.formatMessage(navigationMessages.findTalent)}
    </MenuLink>,
    <MenuLink key="browseJobs" to={paths.browsePools()}>
      {intl.formatMessage(navigationMessages.browseJobs)}
    </MenuLink>,
  ];
  let authLinks = [
    <MenuLink key="sign-in" to={paths.login()}>
      {intl.formatMessage(authMessages.signIn)}
    </MenuLink>,
    <MenuLink key="sign-up" to={paths.register()}>
      {intl.formatMessage(authMessages.signUp)}
    </MenuLink>,
  ];
  if (loggedIn && userAuthInfo) {
    const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
    const userRoleNames = roleAssignments.map((a) => a.role?.name);
    if (
      [
        ROLE_NAME.PoolOperator,
        ROLE_NAME.RequestResponder,
        ROLE_NAME.CommunityManager,
        ROLE_NAME.PlatformAdmin,
        ROLE_NAME.CommunityRecruiter,
        ROLE_NAME.CommunityAdmin,
        ROLE_NAME.ProcessOperator,
      ].some((authorizedRoleName) =>
        userRoleNames?.includes(authorizedRoleName),
      )
    ) {
      menuItems = [
        ...menuItems,
        <MenuLink key="adminDashboard" to={paths.adminDashboard()}>
          {intl.formatMessage({
            defaultMessage: "Admin",
            id: "wHX/8C",
            description: "Title tag for Admin site",
          })}
        </MenuLink>,
      ];
    }
    authLinks = [
      <SignOutConfirmation key="sign-out">
        <LogoutButton>{intl.formatMessage(authMessages.signOut)}</LogoutButton>
      </SignOutConfirmation>,
    ];
    if (hasRole(ROLE_NAME.Applicant, userAuthInfo.roleAssignments)) {
      authLinks = [
        <MenuLink
          key="profile-applications"
          to={paths.profileAndApplications()}
        >
          {intl.formatMessage(navigationMessages.profileAndApplications)}
        </MenuLink>,
        ...authLinks,
      ];
    }
  }

  return (
    <NavMenuComponent
      data-h2-z-index="base(3)"
      mainItems={menuItems}
      utilityItems={authLinks}
    />
  );
};

export default NavigationMenu;
