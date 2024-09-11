import { useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";

import { notEmpty, useIsSmallScreen } from "@gc-digital-talent/helpers";
import { uiMessages } from "@gc-digital-talent/i18n";
import {
  Button,
  NavMenu,
  NavMenuWrapper,
  Separator,
} from "@gc-digital-talent/ui";
import {
  ROLE_NAME,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";

import NotificationDialog from "../NotificationDialog/NotificationDialog";
import useNavContext from "../NavContext/useNavContext";
import { useMainLinks } from "./navlinks";

const SiteNavMenu = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const isSmallScreen = useIsSmallScreen(1080);
  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();
  const { roleLinks, mainLinks, accountLinks, authLinks } = useMainLinks(
    navRole,
    loggedIn,
    userAuthInfo?.roleAssignments?.filter(notEmpty) || [],
  );
  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const [navRoleState, setNavRoleState] = useState(navRole);

  useEffect(() => {
    if (navRole !== navRoleState) {
      setNavRoleState(navRole);
    }
  }, [navRole, navRoleState]);

  const roleAssignments = userAuthInfo?.roleAssignments
    ?.filter(notEmpty)
    .filter(
      (roleAssignment) => roleAssignment.role?.name !== ROLE_NAME.BaseUser,
    );

  const getRoleName: Record<string, string> = {
    ["guest"]: "Guest",
    ["applicant"]: "Applicant",
    ["manager"]: "Manager",
    ["community"]: "Community",
    ["admin"]: "Admin",
  };

  return (
    <>
      <NavMenuWrapper label="Menu" onOpenChange={setMenuOpen} open={isMenuOpen}>
        <NavMenu.List data-h2-flex-direction="base(column) l-tablet(row)">
          {roleAssignments !== undefined && roleAssignments.length > 1 ? (
            <>
              <NavMenu.Item>
                <NavMenu.Trigger
                  color={isSmallScreen ? "black" : "whiteFixed"}
                  mode="text"
                  block={false}
                >
                  {getRoleName[navRole]}
                </NavMenu.Trigger>
                <NavMenu.Content>
                  <NavMenu.List>
                    {roleLinks.map((roleLink) => (
                      <NavMenu.Item key={roleLink.name}>
                        <NavMenu.Link
                          title={roleLink.name}
                          href={roleLink.href}
                          color="black"
                        >
                          {roleLink.name}
                        </NavMenu.Link>
                      </NavMenu.Item>
                    ))}
                  </NavMenu.List>
                </NavMenu.Content>
              </NavMenu.Item>
              <Separator space="none" data-h2-display="l-tablet(none)" />
            </>
          ) : null}
          {mainLinks}
          <Separator space="none" data-h2-display="l-tablet(none)" />
        </NavMenu.List>
        <NavMenu.List
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-margin-top="base(x1) l-tablet(0)"
        >
          {accountLinks && (
            <NavMenu.Item>
              <NavMenu.Trigger
                color={isSmallScreen ? "black" : "whiteFixed"}
                mode="text"
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
          )}
          {loggedIn && (
            <NavMenu.Item data-h2-display="base(none) l-tablet(inline-flex)">
              <NotificationDialog
                open={isNotificationDialogOpen}
                onOpenChange={setNotificationDialogOpen}
              />
            </NavMenu.Item>
          )}
          {authLinks}
        </NavMenu.List>
      </NavMenuWrapper>
      {isSmallScreen && (
        <div
          data-h2-position="base(fixed)"
          data-h2-bottom="base(x.75)"
          data-h2-right="base(x.75)"
          data-h2-z-index="base(9999)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x.5)"
        >
          <Button
            color="blackFixed"
            mode="solid"
            icon={isMenuOpen ? XMarkIcon : Bars3Icon}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen
              ? intl.formatMessage(uiMessages.closeMenu)
              : intl.formatMessage(uiMessages.openMenu)}
          </Button>
          {loggedIn && (
            <NotificationDialog
              open={isNotificationDialogOpen}
              onOpenChange={setNotificationDialogOpen}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SiteNavMenu;
