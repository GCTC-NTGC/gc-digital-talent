import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIntl } from "react-intl";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CloudIcon from "@heroicons/react/24/outline/CloudIcon";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

import { useIsSmallScreen } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";
import {
  Button,
  SideMenu,
  SideMenuButton,
  SideMenuCategory,
  SideMenuContentWrapper,
  SideMenuItem,
} from "@gc-digital-talent/ui";
import { uiMessages, useLocale } from "@gc-digital-talent/i18n";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import SEO, { Favicon } from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import { checkRole } from "~/utils/teamUtils";

import MaintenanceBanner from "../MaintenanceBanner";
import SkipLink from "../SkipLink";
import SignInOrSignOut from "./SignInOrSignOut";

interface OpenMenuButtonProps extends React.HTMLProps<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton = React.forwardRef<
  HTMLButtonElement,
  Omit<OpenMenuButtonProps, "ref">
>(({ children, onClick, show }, ref) =>
  show ? (
    <Button
      ref={ref}
      icon={Bars3Icon}
      onClick={onClick}
      type="button"
      color="secondary"
      data-h2-text-align="base(left)"
      data-h2-radius="base(0)"
      data-h2-align-self="base(flex-start)"
      data-h2-align-items="base(flex-start)"
      data-h2-position="base(sticky)"
      data-h2-top="base(0)"
      data-h2-width="base(100%)"
      data-h2-z-index="base(1)"
    >
      {children}
    </Button>
  ) : null,
);

const AdminLayout = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();
  const isSmallScreen = useIsSmallScreen();
  const { roleAssignments } = useAuthorization();

  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useLocalStorage(
    "digitaltalent-menustate",
    true,
  );
  React.useEffect(() => {
    if (isSmallScreen) {
      setMenuOpen(false); // collapse menu if window resized to small
    }
  }, [isSmallScreen, setMenuOpen]);

  return (
    <>
      <Favicon locale={locale} project="admin" />
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Admin",
          id: "wHX/8C",
          description: "Title tag for Admin site",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "Recruit and manage IT employees in the Government of Canada.",
          id: "J8kIar",
          description: "Meta tag description for Admin site",
        })}
      />
      <SkipLink />
      <div data-h2-flex-grid="base(stretch, 0)">
        <SideMenu
          label={intl.formatMessage({
            defaultMessage: "Main Menu",
            id: "QjF2CL",
            description:
              "Label for the main menu on the pool manager admin portal.",
          })}
          onOpenChange={setMenuOpen}
          open={isMenuOpen}
          footer={<SignInOrSignOut />}
        >
          <SideMenuButton
            icon={XMarkIcon}
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen
              ? intl.formatMessage(uiMessages.closeMenu)
              : intl.formatMessage(uiMessages.openMenu)}
          </SideMenuButton>
          {checkRole(
            [
              ROLE_NAME.PoolOperator,
              ROLE_NAME.RequestResponder,
              ROLE_NAME.CommunityManager,
              ROLE_NAME.PlatformAdmin,
            ],
            roleAssignments,
          ) && (
            <SideMenuItem href={paths.adminDashboard()} icon={HomeIcon}>
              {intl.formatMessage({
                defaultMessage: "Dashboard",
                id: "ArwIQV",
                description: "Title for dashboard",
              })}
            </SideMenuItem>
          )}
          <SideMenuCategory
            title={intl.formatMessage({
              defaultMessage: "Recruitment",
              id: "G65IrS",
              description: "The menu category for recruitment items",
            })}
          >
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.RequestResponder,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem
                href={paths.poolCandidates()}
                icon={IdentificationIcon}
              >
                {intl.formatMessage(adminMessages.poolsCandidates)}
              </SideMenuItem>
            )}
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.CommunityManager,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem href={paths.poolTable()} icon={Squares2X2Icon}>
                {intl.formatMessage(adminMessages.pools)}
              </SideMenuItem>
            )}
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.CommunityManager,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem href={paths.teamTable()} icon={BuildingOffice2Icon}>
                {intl.formatMessage(adminMessages.teams)}
              </SideMenuItem>
            )}
          </SideMenuCategory>
          <SideMenuCategory
            title={intl.formatMessage({
              defaultMessage: "Requests",
              id: "0D3ZhO",
              description: "The menu category for requests items",
            })}
          >
            {checkRole([ROLE_NAME.RequestResponder], roleAssignments) && (
              <SideMenuItem href={paths.searchRequestTable()} icon={TicketIcon}>
                {intl.formatMessage(adminMessages.requests)}
              </SideMenuItem>
            )}
          </SideMenuCategory>
          <SideMenuCategory
            title={intl.formatMessage({
              defaultMessage: "Platform data",
              id: "bLcy4q",
              description: "The menu category for platform data items",
            })}
          >
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.RequestResponder,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem href={paths.userTable()} icon={UserIcon}>
                {intl.formatMessage(adminMessages.users)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.classificationTable()}
                icon={PuzzlePieceIcon}
              >
                {intl.formatMessage(adminMessages.classifications)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.departmentTable()}
                icon={BuildingOfficeIcon}
              >
                {intl.formatMessage(adminMessages.departments)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem href={paths.skillTable()} icon={BoltIcon}>
                {intl.formatMessage(adminMessages.skills)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem href={paths.skillFamilyTable()} icon={CloudIcon}>
                {intl.formatMessage(adminMessages.skillFamilies)}
              </SideMenuItem>
            )}
          </SideMenuCategory>
        </SideMenu>
        <SideMenuContentWrapper>
          <div
            data-h2-min-height="base(100%)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <Header width="full" />
            <MaintenanceBanner />
            <OpenMenuButton
              onClick={() => setMenuOpen(true)}
              show={isSmallScreen}
            >
              {intl.formatMessage({
                defaultMessage: "Open Menu",
                id: "crzWxb",
                description:
                  "Text label for header button that opens side menu.",
              })}
            </OpenMenuButton>
            <main
              id="main"
              data-h2-flex-grow="base(1)"
              data-h2-background-color="base(background)"
            >
              <div data-h2-min-height="base(100%)">
                <Outlet />
              </div>
            </main>
            <Footer width="full" />
          </div>
        </SideMenuContentWrapper>
      </div>

      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

export default AdminLayout;
