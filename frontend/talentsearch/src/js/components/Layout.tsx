import React from "react";
import { useIntl } from "react-intl";
import { Outlet } from "react-router-dom";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";

import MenuLink from "@common/components/Link/MenuLink";
import LocaleRedirect from "@common/components/LocaleRedirect/LocaleRedirect";
import { getRuntimeVariable } from "@common/helpers/runtimeVariable";
import { getLocale } from "@common/helpers/localize";
import useAuth from "@common/hooks/useAuth";
import useFeatureFlags from "@common/hooks/useFeatureFlags";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import { Button } from "@common/components";
import { Helmet } from "react-helmet";
import Footer from "@common/components/Footer";
import NavMenu from "@common/components/NavMenu";
import Header from "@common/components/Header";

import { useAuthRoutes } from "../authRoutes";
import { useTalentSearchRoutes } from "../talentSearchRoutes";
import { useApplicantProfileRoutes } from "../applicantProfileRoutes";
import { useDirectIntakeRoutes } from "../directIntakeRoutes";

const Layout = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const authPaths = useAuthRoutes();
  const talentPaths = useTalentSearchRoutes();
  const profilePaths = useApplicantProfileRoutes();
  const directIntakePaths = useDirectIntakeRoutes();
  const featureFlags = useFeatureFlags();
  const { loggedInUser } = useAuthorizationContext();
  const { loggedIn, logout } = useAuth();
  const [isConfirmationOpen, setConfirmationOpen] =
    React.useState<boolean>(false);

  const aiConnectionString = getRuntimeVariable(
    "APPLICATIONINSIGHTS_CONNECTION_STRING",
  );
  if (aiConnectionString) {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: aiConnectionString,
      },
    });
    appInsights.loadAppInsights();
    appInsights.trackPageView();
  }

  let menuItems = [
    <MenuLink key="home" to={talentPaths.home()} end>
      {intl.formatMessage({
        defaultMessage: "Home",
        id: "G1RNXj",
        description: "Link to the Homepage in the nav menu.",
      })}
    </MenuLink>,
    <MenuLink key="search" to={talentPaths.search()}>
      {intl.formatMessage({
        defaultMessage: "Search",
        id: "OezjH3",
        description: "Label displayed on the Search menu item.",
      })}
    </MenuLink>,
  ];

  if (featureFlags.directIntake) {
    menuItems = [
      ...menuItems,
      <MenuLink key="browseOpportunities" to={directIntakePaths.allPools()}>
        {intl.formatMessage({
          defaultMessage: "Browse opportunities",
          id: "SXvOXV",
          description: "Label displayed on the browse pools menu item.",
        })}
      </MenuLink>,
    ];

    if (featureFlags.directIntake && loggedIn && loggedInUser?.id) {
      menuItems = [
        ...menuItems,
        <MenuLink
          key="myApplications"
          to={directIntakePaths.applications(loggedInUser.id)}
        >
          {intl.formatMessage({
            defaultMessage: "My applications",
            id: "ioghLh",
            description:
              "Label displayed on the users pool applications menu item.",
          })}
        </MenuLink>,
      ];
    }
  }

  if (loggedIn && loggedInUser?.id) {
    menuItems = [
      ...menuItems,
      <MenuLink key="myProfile" to={profilePaths.home(loggedInUser.id)}>
        {intl.formatMessage({
          defaultMessage: "My profile",
          id: "5lBIzg",
          description: "Label displayed on the applicant profile menu item.",
        })}
      </MenuLink>,
    ];
  }

  let authLinks = [
    <MenuLink key="login-info" to={authPaths.login()}>
      {intl.formatMessage({
        defaultMessage: "Login",
        id: "md7Klw",
        description: "Label displayed on the login link menu item.",
      })}
    </MenuLink>,
    <MenuLink key="register" to={authPaths.register()}>
      {intl.formatMessage({
        defaultMessage: "Register",
        id: "LMGaDQ",
        description: "Label displayed on the register link menu item.",
      })}
    </MenuLink>,
  ];

  if (loggedIn) {
    authLinks = [
      <Button
        key="logout"
        mode="outline"
        as="button"
        onClick={() => {
          if (loggedIn) {
            setConfirmationOpen(true);
          }
        }}
      >
        {intl.formatMessage({
          defaultMessage: "Logout",
          id: "3vDhoc",
          description: "Label displayed on the logout link menu item.",
        })}
      </Button>,
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
      <a
        href="#main"
        data-h2-visibility="base(invisible) base:focus-visible(visible)"
      >
        {intl.formatMessage({
          defaultMessage: "Skip to main content",
          id: "Srs7a4",
          description: "Assistive technology skip link",
        })}
      </a>
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
      <LocaleRedirect />
    </>
  );
};

export default Layout;
