import React from "react";
import { useIntl } from "react-intl";
import { AnimatePresence } from "framer-motion";

import NavMenu from "@common/components/NavMenu";
import MenuLink from "@common/components/Link/MenuLink";
import { Toast } from "@common/components";
import LocaleRedirect from "@common/components/LocaleRedirect/LocaleRedirect";
import { useLocation, ScrollToTop } from "@common/helpers/router";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getLocale } from "@common/helpers/localize";
import { getRuntimeVariable } from "@common/helpers/runtimeVariable";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { useIndigenousApprenticeshipRoutes } from "../routes/indigenousApprenticeshipRoutes";

export const Layout = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const location = useLocation();
  const paths = useIndigenousApprenticeshipRoutes();

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

  return (
    <AnimatePresence>
      <React.Fragment key={location.pathname}>
        <Helmet>
          <html lang={locale} />
          <title>
            {intl.formatMessage({
              defaultMessage: "Indigenous Apprenticeship Program",
              id: "C5tUG2",
              description:
                "Title tag for Indigenous Apprenticeship Program site",
            })}
          </title>
          <meta
            name="description"
            content={intl.formatMessage({
              defaultMessage:
                "Apply now to get started on your IT career journey.",
              id: "Oh1/Gc",
              description:
                "Meta tag description for Indigenous Apprenticeship Program site",
            })}
          />
        </Helmet>

        <ScrollToTop />
        <a href="#main" data-h2-visibility="base(hidden)">
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
          style={{ height: "100vh", margin: "0" }}
        >
          <div>
            <Header />
            <NavMenu
              mainItems={[
                <MenuLink key="home" to={paths.home()}>
                  {intl.formatMessage({
                    defaultMessage: "Home",
                    id: "TFeQL2",
                    description:
                      "Link to the homepage for indigenous apprenticeship program.",
                  })}
                </MenuLink>,
              ]}
            />
          </div>
          <main id="main">
            <Outlet />
          </main>
          <div style={{ marginTop: "auto" }}>
            <Footer />
          </div>
        </div>
        <Toast />
        <LocaleRedirect />
      </React.Fragment>
    </AnimatePresence>
  );
};

export default Layout;
