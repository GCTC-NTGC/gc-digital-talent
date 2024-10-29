import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { HTMLProps, forwardRef, useEffect } from "react";

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
import { uiMessages, getLocale } from "@gc-digital-talent/i18n";
import {
  ROLE_NAME,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";

import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import SEO, { Favicon } from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useLayoutTheme from "~/hooks/useLayoutTheme";
import { checkRole } from "~/utils/teamUtils";
import pageTitles from "~/messages/pageTitles";
import pageIcons from "~/utils/pageIcons";
import useErrorMessages from "~/hooks/useErrorMessages";
import NotificationDialog from "~/components/NotificationDialog/NotificationDialog";

import SitewideBanner from "../SitewideBanner";
import SkipLink from "../SkipLink";
import SignInOrSignOut from "./SignInOrSignOut";

interface OpenMenuButtonProps extends HTMLProps<HTMLButtonElement> {
  show: boolean;
}

const OpenMenuButton = forwardRef<
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

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  useLayoutTheme("default");
  const isSmallScreen = useIsSmallScreen();
  const { roleAssignments } = useAuthorization();
  const { loggedIn } = useAuthentication();

  // retain menu preference in storage
  const [isMenuOpen, setMenuOpen] = useLocalStorage(
    "digitaltalent-menustate",
    true,
  );
  useEffect(() => {
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
              ROLE_NAME.CommunityAdmin,
              ROLE_NAME.CommunityRecruiter,
              ROLE_NAME.ProcessOperator,
            ],
            roleAssignments,
          ) && (
            <>
              <SideMenuItem
                href={paths.adminDashboard()}
                icon={pageIcons.dashboard.outline}
              >
                {intl.formatMessage(pageTitles.dashboard)}
              </SideMenuItem>
              {loggedIn && <NotificationDialog sideMenu />}
            </>
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
                icon={pageIcons.poolCandidates.outline}
              >
                {intl.formatMessage(pageTitles.candidateSearch)}
              </SideMenuItem>
            )}
            {checkRole(
              [
                ROLE_NAME.PoolOperator,
                ROLE_NAME.CommunityManager,
                ROLE_NAME.PlatformAdmin,
                ROLE_NAME.CommunityAdmin,
                ROLE_NAME.CommunityRecruiter,
                ROLE_NAME.ProcessOperator,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem
                href={paths.poolTable()}
                icon={pageIcons.processes.outline}
              >
                {intl.formatMessage(pageTitles.processes)}
              </SideMenuItem>
            )}
            {checkRole(
              [
                ROLE_NAME.CommunityAdmin,
                ROLE_NAME.CommunityRecruiter,
                ROLE_NAME.PlatformAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem
                href={paths.communityTable()}
                icon={pageIcons.communities.outline}
              >
                {intl.formatMessage(pageTitles.communities)}
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
              <SideMenuItem
                href={paths.teamTable()}
                icon={pageIcons.teams.outline}
              >
                {intl.formatMessage(pageTitles.teams)}
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
              <SideMenuItem
                href={paths.skills()}
                icon={pageIcons.skillsList.outline}
              >
                {intl.formatMessage(pageTitles.skillsList)}
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
              <SideMenuItem
                href={paths.jobPosterTemplates()}
                icon={pageIcons.jobTemplates.outline}
              >
                {intl.formatMessage({
                  defaultMessage: "Job templates",
                  id: "Ilg37j",
                  description: "Title for job templates",
                })}
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
            {checkRole(
              [
                ROLE_NAME.RequestResponder,
                ROLE_NAME.CommunityRecruiter,
                ROLE_NAME.CommunityAdmin,
              ],
              roleAssignments,
            ) && (
              <SideMenuItem
                href={paths.searchRequestTable()}
                icon={pageIcons.talentRequests.outline}
              >
                {intl.formatMessage(pageTitles.talentRequests)}
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
              <SideMenuItem
                href={paths.userTable()}
                icon={pageIcons.users.outline}
              >
                {intl.formatMessage(pageTitles.users)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.classificationTable()}
                icon={pageIcons.classifications.outline}
              >
                {intl.formatMessage(pageTitles.classifications)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.departmentTable()}
                icon={pageIcons.departments.outline}
              >
                {intl.formatMessage(pageTitles.departments)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.skillTable()}
                icon={pageIcons.skillsEditor.outline}
              >
                {intl.formatMessage(pageTitles.skillsEditor)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.skillFamilyTable()}
                icon={pageIcons.skillFamilies.outline}
              >
                {intl.formatMessage(pageTitles.skillFamilies)}
              </SideMenuItem>
            )}
            {checkRole([ROLE_NAME.PlatformAdmin], roleAssignments) && (
              <SideMenuItem
                href={paths.announcements()}
                icon={pageIcons.announcements.outline}
              >
                {intl.formatMessage(pageTitles.announcements)}
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

export const ErrorBoundary = () => {
  const location = useLocation();
  const error = useErrorMessages();
  const logger = useLogger();

  logger.notice(
    JSON.stringify({
      message: "ErrorPage triggered",
      pathname: location.pathname,
      error,
    }),
  );

  return (
    <div data-h2-margin="base(x3, 0)">
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(flex-start, x3)">
          <div data-h2-flex-item="base(1of1)" data-h2-text-align="base(center)">
            <h3
              data-h2-font-size="base(h4, 1.3)"
              data-h2-font-weight="base(700)"
              data-h2-margin="base(0, 0, x1, 0)"
            >
              {error.messages.title}
            </h3>
            {error.messages.body}
          </div>
        </div>
      </div>
    </div>
  );
};

Component.displayName = "AdminLayout";
ErrorBoundary.displayName = "AdminErrorBoundary";

export default Component;
