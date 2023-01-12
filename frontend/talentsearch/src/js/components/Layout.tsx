import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router-dom";

import MenuLink from "@common/components/Link/MenuLink";
import SkipLink from "@common/components/Link/SkipLink";
import LogoutConfirmation from "@common/components/LogoutConfirmation";
import { getLocale } from "@common/helpers/localize";
import useAuth from "@common/hooks/useAuth";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import Footer from "@common/components/Footer";
import NavMenu from "@common/components/NavMenu";
import Header from "@common/components/Header";

import useRoutes from "../hooks/useRoutes";

interface LogoutButtonProps extends React.HTMLProps<HTMLButtonElement> {
  children: React.ReactNode;
}
export const LogoutButton = React.forwardRef<
  HTMLButtonElement,
  LogoutButtonProps
>(({ children, ...rest }, forwardedRef) => (
  <button
    data-h2-color="base(dt-primary)"
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
  const locale = getLocale(intl);
  const paths = useRoutes();

  const { loggedInUser } = useAuthorizationContext();
  const { loggedIn } = useAuth();

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
    <MenuLink key="browseOpportunities" to={paths.allPools()}>
      {intl.formatMessage({
        defaultMessage: "Browse opportunities",
        id: "SXvOXV",
        description: "Label displayed on the browse pools menu item.",
      })}
    </MenuLink>,
  ];

  if (loggedIn && loggedInUser?.id) {
    menuItems = [
      ...menuItems,
      <MenuLink key="myApplications" to={paths.applications(loggedInUser.id)}>
        {intl.formatMessage({
          defaultMessage: "My applications",
          id: "ioghLh",
          description:
            "Label displayed on the users pool applications menu item.",
        })}
      </MenuLink>,
      <MenuLink key="myProfile" to={paths.profile(loggedInUser.id)}>
        {intl.formatMessage({
          defaultMessage: "My profile",
          id: "5lBIzg",
          description: "Label displayed on the applicant profile menu item.",
        })}
      </MenuLink>,
    ];
  }

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

  if (loggedIn) {
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
  }

  return (
    <>
      <Helmet>
        <html lang={locale} />
        <title>
          {intl.formatMessage({
            defaultMessage: "GC Digital Talent",
            id: "Mz+gUV",
            description: "Title tag for Talent Search site",
          })}
        </title>
        <meta
          name="description"
          content={intl.formatMessage({
            defaultMessage:
              "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
            id: "jRmRd+",
            description: "Meta tag description for Talent Search site",
          })}
        />
      </Helmet>
      <SkipLink />
      <div
        className="container"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-height="base(100vh)"
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
