import React from "react";
import { useIntl } from "react-intl";
import { useLocation, Outlet, ScrollRestoration } from "react-router-dom";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { AnimatePresence } from "framer-motion";

import SEO, { Favicon } from "@common/components/SEO/SEO";
import NavMenu from "@common/components/NavMenu";
import MenuLink from "@common/components/Link/MenuLink";
import SkipLink from "@common/components/Link/SkipLink";
import Header from "@common/components/Header";
import Footer from "@common/components/Footer";
import { getLocale } from "@common/helpers/localize";
import { getRuntimeVariable } from "@common/helpers/runtimeVariable";
// import { Messages } from "@common/components/context/LanguageProvider";
// import NestedLanguageProvider from "@common/components/context/NestedLanguageProvider";

import useRoutes from "~/hooks/useRoutes";

/**
 * TODO: This will be implemented in #4617
 *
 * Wrap entire component in <NestedLanguageProvider messages={messages} />
 * */

// import * as crgMessages from "../lang/crgCompiled.json";
// import * as crkMessages from "../lang/crkCompiled.json";
// import * as ojwMessages from "../lang/ojwCompiled.json";
// import * as micMessages from "../lang/micCompiled.json";

// const messages: Map<string, Messages> = new Map([
//   ["crg", crgMessages],
//   ["crk", crkMessages],
//   ["ojw", ojwMessages],
//   ["mic", micMessages],
// ]);

const Layout = () => {
  const intl = useIntl();
  const location = useLocation();
  const paths = useRoutes();

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
        <Favicon project="iap" />
        <SEO
          title={intl.formatMessage({
            defaultMessage: "Indigenous Apprenticeship Program",
            id: "C5tUG2",
            description: "Title tag for Indigenous Apprenticeship Program site",
          })}
          description={intl.formatMessage({
            defaultMessage:
              "Apply now to get started on your IT career journey.",
            id: "Oh1/Gc",
            description:
              "Meta tag description for Indigenous Apprenticeship Program site",
          })}
        />
        <SkipLink />
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
                <MenuLink key="home" to={paths.iap()}>
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
        <ScrollRestoration />
      </React.Fragment>
    </AnimatePresence>
  );
};

export default Layout;
