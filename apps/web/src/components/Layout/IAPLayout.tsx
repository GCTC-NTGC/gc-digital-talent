import React from "react";
import { useIntl } from "react-intl";
import { useLocation, Outlet, ScrollRestoration } from "react-router-dom";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { AnimatePresence } from "framer-motion";

import { SkipLink } from "@gc-digital-talent/ui";
import { NestedLanguageProvider, Messages } from "@gc-digital-talent/i18n";
import { getRuntimeVariable } from "@gc-digital-talent/env";
import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";

import SEO, { Favicon } from "~/components/SEO/SEO";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import IAPNavMenu from "~/components/NavMenu/IAPNavMenu";

import useLayoutTheme from "~/hooks/useLayoutTheme";

import * as crgMessages from "~/lang/crgCompiled.json";
import * as crkMessages from "~/lang/crkCompiled.json";
import * as ojwMessages from "~/lang/ojwCompiled.json";
import * as micMessages from "~/lang/micCompiled.json";

const messages: Map<string, Messages> = new Map([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

const IAPSeo = () => {
  const intl = useIntl();

  return (
    <SEO
      title={intl.formatMessage({
        defaultMessage: "IT Apprenticeship Program for Indigenous Peoples",
        id: "oMpO+C",
        description:
          "Title tag for IT Apprenticeship Program for Indigenous Peoples site",
      })}
      description={intl.formatMessage({
        defaultMessage: "Apply now to get started on your IT career journey.",
        id: "Z9W+O2",
        description:
          "Meta tag description for IT Apprenticeship Program for Indigenous Peoples site",
      })}
    />
  );
};

const Layout = () => {
  const location = useLocation();
  const { user } = useAuthorization();
  const { loggedIn } = useAuthentication();
  useLayoutTheme("iap");

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
    <NestedLanguageProvider messages={messages}>
      <AnimatePresence>
        <React.Fragment key={location.pathname}>
          <Favicon project="iap" />
          <IAPSeo />
          <SkipLink />
          <div
            className="container"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-min-height="base(100vh)"
            data-h2-margin="base(0)"
          >
            <div>
              <Header />
              <IAPNavMenu {...{ loggedIn, user }} />
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
    </NestedLanguageProvider>
  );
};

export default Layout;
