import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration, useSearchParams } from "react-router-dom";

import { Flourish, MenuLink } from "@gc-digital-talent/ui";
import {
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
  hasRole,
} from "@gc-digital-talent/auth";
import {
  commonMessages,
  navigationMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SEO, { Favicon } from "~/components/SEO/SEO";
import NavMenu from "~/components/NavMenu/NavMenu";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import SignOutConfirmation from "~/components/SignOutConfirmation/SignOutConfirmation";
import useRoutes from "~/hooks/useRoutes";
import useLayoutTheme from "~/hooks/useLayoutTheme";
import authMessages from "~/messages/authMessages";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import LogoutButton from "./LogoutButton";
import SitewideBanner from "./SitewideBanner";
import SkipLink from "./SkipLink";
import SiteNavMenu from "../NavMenu/SiteNavMenu";

export { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  useLayoutTheme("default");

  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

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
    <>
      <Favicon locale={locale} project="digital-talent" />
      <SEO
        title={intl.formatMessage(commonMessages.projectTitle)}
        description={intl.formatMessage({
          defaultMessage:
            "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
          id: "jRmRd+",
          description: "Meta tag description for Talent Search site",
        })}
      />
      <SkipLink />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-min-height="base(100vh)"
        data-h2-margin="base(0)"
        data-h2-color="base(black)"
      >
        <Header />
        <SitewideBanner />
        <Flourish />
        {!iapPersonality ? (
          <SiteNavMenu />
        ) : (
          <IAPNavMenu {...{ loggedIn, userAuthInfo }} />
        )}
        <main id="main">
          <Outlet />
        </main>
        <div style={{ marginTop: "auto" }}>
          <Footer />
        </div>
      </div>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
};

Component.displayName = "Layout";
