import { useEffect, useState } from "react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { useIntl } from "react-intl";

import { notEmpty, useIsSmallScreen } from "@gc-digital-talent/helpers";
import { getLocalizedName, uiMessages } from "@gc-digital-talent/i18n";
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

import UnreadAlertBellIcon from "./UnreadAlertBellIcon";
import NotificationDialog from "../NotificationDialog/NotificationDialog";
import useNavContext from "../NavContext/useNavContext";
import { useMainLinks } from "./navlinks";

interface SiteNavMenuProps {}

const SiteNavMenu = () => {
  const intl = useIntl();
  const isSmallScreen = useIsSmallScreen(1080);
  const { navRole } = useNavContext();
  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();
  const { mainLinks, accountLinks, authLinks } = useMainLinks(
    navRole,
    loggedIn,
  );
  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  const [isNotificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const roleAssignments = userAuthInfo?.roleAssignments?.filter(notEmpty);
  const onlyHasApplicantRole =
    roleAssignments?.length === 1 &&
    roleAssignments?.find(
      (roleAssignment) => roleAssignment.role?.name === ROLE_NAME.Applicant,
    );
  const currentRoleName = roleAssignments?.find(
    (roleAssignment) => roleAssignment.role?.name === navRole,
  )?.role?.displayName;
  return (
    <>
      <NavMenuWrapper label="Menu" onOpenChange={setMenuOpen} open={isMenuOpen}>
        <NavMenu.List data-h2-flex-direction="base(column) l-tablet(row)">
          {!onlyHasApplicantRole ? (
            <NavMenu.Item>
              <NavMenu.Trigger
                color={isSmallScreen ? "black" : "whiteFixed"}
                mode="text"
                block={false}
              >
                {getLocalizedName(currentRoleName, intl)}
              </NavMenu.Trigger>
              <NavMenu.Content>
                <NavMenu.List>
                  {roleAssignments?.map((roleAssignment) => (
                    <NavMenu.Item key={roleAssignment.role?.name}>
                      <NavMenu.Link
                        title={roleAssignment.role?.name}
                        href="/"
                        color="black"
                      >
                        {getLocalizedName(
                          roleAssignment.role?.displayName,
                          intl,
                        )}
                      </NavMenu.Link>
                    </NavMenu.Item>
                  ))}
                </NavMenu.List>
              </NavMenu.Content>
            </NavMenu.Item>
          ) : null}
          <Separator space="none" data-h2-display="l-tablet(none)" />
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
          <NotificationDialog
            open={isNotificationDialogOpen}
            onOpenChange={setNotificationDialogOpen}
          />
        </div>
      )}
    </>
  );
};

export default SiteNavMenu;
