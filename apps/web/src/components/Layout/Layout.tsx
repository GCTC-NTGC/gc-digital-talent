import React from "react";
import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router-dom";

import { MenuLink, SkipLink } from "@gc-digital-talent/ui";
// import { NestedLanguageProvider, Messages } from "@gc-digital-talent/i18n";
import {
  useAuthentication,
  useAuthorization,
  ROLE_NAME,
  hasRole,
} from "@gc-digital-talent/auth";
import { useTheme } from "@gc-digital-talent/theme";
import { useFeatureFlags } from "@gc-digital-talent/env";

import SEO, { Favicon } from "~/components/SEO/SEO";
import NavMenu from "~/components/NavMenu";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import LogoutConfirmation from "~/components/LogoutConfirmation";

import useRoutes from "~/hooks/useRoutes";

interface LogoutButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode;
}
export const LogoutButton = React.forwardRef<
  HTMLButtonElement,
  LogoutButtonProps
>(({ children, ...rest }, forwardedRef) => (
  <button
    data-h2-color="base(black) base:hover(primary)"
    data-h2-font-size="base(normal)"
    data-h2-text-decoration="base(underline)"
    style={{
      background: "none",
    }}
    ref={forwardedRef}
    {...rest}
    type="button"
  >
    {children}
  </button>
));

const Layout = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { setTheme } = useTheme();
  const { applicantDashboard } = useFeatureFlags();

  React.useEffect(() => {
    setTheme("default", "light");
  }, [setTheme]);

  const { user } = useAuthorization();
  const { loggedIn } = useAuthentication();

  let menuItems = [
    <MenuLink key="home" to={paths.home()} end>
      {intl.formatMessage({
        defaultMessage: "Home",
        id: "G1RNXj",
        description: "Link to the Homepage in the nav menu.",
      })}
    </MenuLink>,
    <MenuLink key="search" to={paths.search()}>
      {intl.formatMessage({
        defaultMessage: "Search",
        id: "OezjH3",
        description: "Label displayed on the Search menu item.",
      })}
    </MenuLink>,
    <MenuLink key="browseOpportunities" to={paths.browsePools()}>
      {intl.formatMessage({
        defaultMessage: "Browse opportunities",
        id: "SXvOXV",
        description: "Label displayed on the browse pools menu item.",
      })}
    </MenuLink>,
  ];

  let authLinks = [
    <MenuLink key="login-info" to={paths.login()}>
      {intl.formatMessage({
        defaultMessage: "Login",
        id: "md7Klw",
        description: "Label displayed on the login link menu item.",
      })}
    </MenuLink>,
    <MenuLink key="register" to={paths.register()}>
      {intl.formatMessage({
        defaultMessage: "Register",
        id: "LMGaDQ",
        description: "Label displayed on the register link menu item.",
      })}
    </MenuLink>,
  ];

  if (loggedIn && user) {
    const userRoleNames = user?.roleAssignments?.map((a) => a.role?.name);

    menuItems = [
      ...menuItems,
      <MenuLink key="myApplications" to={paths.applications(user.id)}>
        {intl.formatMessage({
          defaultMessage: "My applications",
          id: "ioghLh",
          description:
            "Label displayed on the users pool applications menu item.",
        })}
      </MenuLink>,
      <MenuLink key="myProfile" to={paths.profile(user.id)}>
        {intl.formatMessage({
          defaultMessage: "My profile",
          id: "5lBIzg",
          description: "Label displayed on the applicant profile menu item.",
        })}
      </MenuLink>,
    ];
    if (
      [
        ROLE_NAME.PoolOperator,
        ROLE_NAME.RequestResponder,
        ROLE_NAME.PlatformAdmin,
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
      <LogoutConfirmation key="logout">
        <LogoutButton>
          {intl.formatMessage({
            defaultMessage: "Logout",
            id: "3vDhoc",
            description: "Label displayed on the logout link menu item.",
          })}
        </LogoutButton>
      </LogoutConfirmation>,
    ];

    if (
      applicantDashboard &&
      hasRole(ROLE_NAME.Applicant, user.roleAssignments)
    ) {
      authLinks = [
        <MenuLink key="dashboard" to={paths.dashboard()}>
          {intl.formatMessage({
            defaultMessage: "My dashboard",
            id: "LRZeax",
            description:
              "Label displayed on the applicant dashboard menu item.",
          })}
        </MenuLink>,
        ...authLinks,
      ];
    }
  }

  return (
    <>
      <Favicon project="digital-talent" />
      <SEO
        title={intl.formatMessage({
          defaultMessage: "GC Digital Talent",
          id: "Mz+gUV",
          description: "Title tag for Talent Search site",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
          id: "jRmRd+",
          description: "Meta tag description for Talent Search site",
        })}
      />
      <SkipLink />
      <div
        className="container"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-min-height="base(100vh)"
        data-h2-margin="base(0)"
        data-h2-color="base(black) base:dark(white)"
      >
        <div>
          <Header />
          <NavMenu mainItems={menuItems} utilityItems={authLinks} />
        </div>
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

export default Layout;
