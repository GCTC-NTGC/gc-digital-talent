import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useIntl } from "react-intl";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
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
import useLayoutTheme from "~/hooks/useLayoutTheme";
import { checkRole } from "~/utils/teamUtils";
import {
  pageTitle as indexPoolPageTitle,
  pageOutlineIcon as indexPoolPageIcon,
} from "~/pages/Pools/IndexPoolPage/IndexPoolPage";
import {
  pageTitle as allPoolCandidatesPageTitle,
  pageOutlineIcon as allPoolCandidatesPageIcon,
} from "~/pages/PoolCandidates/AllPoolCandidatesPage/AllPoolCandidatesPage";
import {
  pageTitle as indexSearchRequestPageTitle,
  pageOutlineIcon as indexSearchRequestPageIcon,
} from "~/pages/SearchRequests/IndexSearchRequestPage/IndexSearchRequestPage";
import {
  pageTitle as indexTeamPageTitle,
  pageOutlineIcon as indexTeamPageIcon,
} from "~/pages/Teams/IndexTeamPage/IndexTeamPage";
import {
  pageTitle as indexUserPageTitle,
  pageOutlineIcon as indexUserPageIcon,
} from "~/pages/Users/IndexUserPage/IndexUserPage";
import {
  pageTitle as adminDashboardPageTitle,
  pageOutlineIcon as adminDashboardPageIcon,
} from "~/pages/AdminDashboardPage/AdminDashboardPage";
import {
  pageTitle as indexClassificationPageTitle,
  pageOutlineIcon as indexClassificationPageIcon,
} from "~/pages/Classifications/IndexClassificationPage";
import {
  pageTitle as indexDepartmentPageTitle,
  pageOutlineIcon as indexDepartmentPageIcon,
} from "~/pages/Departments/IndexDepartmentPage";
import {
  pageTitle as indexSkillPageTitle,
  pageOutlineIcon as indexSkillPageIcon,
} from "~/pages/Skills/IndexSkillPage";
import {
  pageTitle as indexSkillFamilyPageTitle,
  pageOutlineIcon as indexSkillFamilyPageIcon,
} from "~/pages/SkillFamilies/IndexSkillFamilyPage";
import {
  pageTitle as announcementsPageTitle,
  pageOutlineIcon as announcementsPageIcon,
} from "~/pages/AnnouncementsPage/AnnouncementsPage";
import {
  adminPageTitle as skillPageTitle,
  pageOutlineIcon as skillPageIcon,
} from "~/pages/Skills/SkillPage";

import SitewideBanner from "../SitewideBanner";
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
      color="blackFixed"
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
  useLayoutTheme("default");
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
            icon={isMenuOpen ? XMarkIcon : Bars3Icon}
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
            <SideMenuItem
              href={paths.adminDashboard()}
              icon={adminDashboardPageIcon}
            >
              {intl.formatMessage(adminDashboardPageTitle)}
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
                icon={allPoolCandidatesPageIcon}
              >
                {intl.formatMessage(allPoolCandidatesPageTitle)}
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
              <SideMenuItem href={paths.poolTable()} icon={indexPoolPageIcon}>
                {intl.formatMessage(indexPoolPageTitle)}
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
              <SideMenuItem href={paths.teamTable()} icon={indexTeamPageIcon}>
                {intl.formatMessage(indexTeamPageTitle)}
              </SideMenuItem>
            )}
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.RequestResponder,
                ROLE_NAME.CommunityManager,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem href={paths.skills()} icon={skillPageIcon}>
                {intl.formatMessage(skillPageTitle)}
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
              <SideMenuItem
                href={paths.searchRequestTable()}
                icon={indexSearchRequestPageIcon}
              >
                {intl.formatMessage(indexSearchRequestPageTitle)}
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
              <SideMenuItem href={paths.userTable()} icon={indexUserPageIcon}>
                {intl.formatMessage(indexUserPageTitle)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.classificationTable()}
                icon={indexClassificationPageIcon}
              >
                {intl.formatMessage(indexClassificationPageTitle)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.departmentTable()}
                icon={indexDepartmentPageIcon}
              >
                {intl.formatMessage(indexDepartmentPageTitle)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem href={paths.skillTable()} icon={indexSkillPageIcon}>
                {intl.formatMessage(indexSkillPageTitle)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.skillFamilyTable()}
                icon={indexSkillFamilyPageIcon}
              >
                {intl.formatMessage(indexSkillFamilyPageTitle)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.announcements()}
                icon={announcementsPageIcon}
              >
                {intl.formatMessage(announcementsPageTitle)}
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
            <SitewideBanner />
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
