import { useIntl } from "react-intl";
import { useState } from "react";

import { notEmpty, useIsSmallScreen } from "@gc-digital-talent/helpers";
import { NavMenu } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import useNavContext from "../NavContext/useNavContext";
import useMainNavLinks from "./useMainNavLinks";
import navMenuMessages from "./messages";
import Menu, { borderItem } from "./Menu";
import authMessages from "~/messages/authMessages";
import MenuSeparator from "./MenuSeparator";
import NotificationDialog from "../NotificationDialog/NotificationDialog";
import NavItem from "./MenuItem";
import HomeLink from "./HomeLink";
import { useAuthentication } from "@gc-digital-talent/auth";

const MainNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen("sm");
  const paths = useRoutes();
  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();
  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const { roleLinks, mainLinks, resourceLinks, accountLinks, systemSettings } =
    useMainNavLinks();

  const usefulRoleAssignments =
    userAuthInfo?.roleAssignments
      ?.filter(notEmpty)
      ?.filter(
        (roleAssignment) => roleAssignment.role?.name !== ROLE_NAME.BaseUser,
      ) ?? [];

  const roleNames = {
    applicant: intl.formatMessage(navMenuMessages.applicant),
    community: intl.formatMessage(navMenuMessages.community),
    admin: intl.formatMessage(navMenuMessages.admin),
  } as const;

  const hasMoreThanOneRole =
    navRole !== null && usefulRoleAssignments.length > 1;

  const onlyHasOneRoleNotApplicant =
    navRole !== null &&
    usefulRoleAssignments.length === 1 &&
    usefulRoleAssignments[0].role?.name !== ROLE_NAME.Applicant;

  const showRoleSwitcher = onlyHasOneRoleNotApplicant || hasMoreThanOneRole;

  return (
    <Menu accountLinks={accountLinks}>
      <NavMenu.List type="main">
        <HomeLink
          href={paths.home()}
          label={intl.formatMessage(navigationMessages.home)}
        />
        {showRoleSwitcher ? (
          <>
            <NavMenu.Item className={borderItem({ borderRight: true })}>
              <NavMenu.Trigger
                color={isSmallScreen ? "black" : "white"}
                fixedColor={!isSmallScreen}
                block={false}
              >
                {roleNames[navRole]}
              </NavMenu.Trigger>
              <NavMenu.Content>
                <NavMenu.List>
                  {roleLinks.map((roleLink) => (
                    <NavMenu.Item key={roleLink.name}>
                      <NavMenu.Link
                        title={roleLink.name}
                        href={roleLink.href}
                        type="subMenuLink"
                      >
                        {roleLink.name}
                      </NavMenu.Link>
                    </NavMenu.Item>
                  ))}
                </NavMenu.List>
              </NavMenu.Content>
            </NavMenu.Item>
          </>
        ) : null}
        {showRoleSwitcher && <MenuSeparator orientation="horizontal" />}

        {mainLinks}
        {systemSettings && (
          <NavMenu.Item>
            <NavMenu.Trigger
              color={isSmallScreen ? "black" : "white"}
              fixedColor={!isSmallScreen}
              block={false}
            >
              {intl.formatMessage({
                defaultMessage: "System settings",
                id: "COIe6t",
                description:
                  "Nav menu trigger for system settings links sub menu",
              })}
            </NavMenu.Trigger>
            <NavMenu.Content>
              <NavMenu.List>{systemSettings}</NavMenu.List>
            </NavMenu.Content>
          </NavMenu.Item>
        )}

        <NavMenu.Item>
          <NavMenu.Trigger
            color={isSmallScreen ? "black" : "white"}
            fixedColor={!isSmallScreen}
            block={false}
          >
            {intl.formatMessage({
              defaultMessage: "Resources",
              id: "T74kMc",
              description: "Nav menu trigger for resource links sub menu",
            })}
          </NavMenu.Trigger>
          <NavMenu.Content>
            <NavMenu.List>{resourceLinks}</NavMenu.List>
          </NavMenu.Content>
        </NavMenu.Item>
        <MenuSeparator orientation="horizontal" />

        {accountLinks && (
          <>
            <NavMenu.Item>
              <NavMenu.Trigger
                color={isSmallScreen ? "black" : "white"}
                fixedColor={!isSmallScreen}
                block={false}
              >
                {intl.formatMessage({
                  defaultMessage: "Your account",
                  id: "CBedVL",
                  description: "Nav menu trigger for account links sub menu",
                })}
              </NavMenu.Trigger>
              <NavMenu.Content>
                <NavMenu.List>{accountLinks}</NavMenu.List>
              </NavMenu.Content>
            </NavMenu.Item>
          </>
        )}

        {loggedIn && (
          <NavMenu.Item
            className={borderItem({
              borderLeft: true,
              class: "hidden before:mr-3 sm:inline-flex",
            })}
          >
            <NavMenu.Trigger
              color={isSmallScreen ? "black" : "white"}
              fixedColor={!isSmallScreen}
              block={false}
            >
              <NotificationDialog
                open={isNotificationDialogOpen}
                onOpenChange={setNotificationDialogOpen}
              />
            </NavMenu.Trigger>
          </NavMenu.Item>
        )}

        {!loggedIn ? (
          <>
            <NavItem
              key="signIn"
              href={paths.login()}
              title={intl.formatMessage(authMessages.signIn)}
            />
            <NavItem
              key="signUp"
              href={paths.register()}
              title={intl.formatMessage(authMessages.signUp)}
            />
          </>
        ) : null}
      </NavMenu.List>
    </Menu>
  );
};
export default MainNavMenu;
