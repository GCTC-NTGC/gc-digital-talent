import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useLocation, Outlet, ScrollRestoration } from "react-router";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { AnimatePresence } from "motion/react";

import {
  NestedLanguageProvider,
  Messages,
  commonMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import { getRuntimeVariable } from "@gc-digital-talent/env";

import SEO, { Favicon } from "~/components/SEO/SEO";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import IAPNavMenu from "~/components/NavMenu/IAPNavMenu";
import useLayoutTheme from "~/hooks/useLayoutTheme";
import crgMessages from "~/lang/crgCompiled.json";
import crkMessages from "~/lang/crkCompiled.json";
import ojwMessages from "~/lang/ojwCompiled.json";
import micMessages from "~/lang/micCompiled.json";

import SkipLink from "./SkipLink";
import SitewideBanner from "./SitewideBanner";
import ErrorBoundary from "./RouteErrorBoundary/RouteErrorBoundary";
export { ErrorBoundary };

const messages = new Map<string, Messages>([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

const IAPSeo = () => {
  const intl = useIntl();

  return (
    <SEO
      title={intl.formatMessage(commonMessages.iapTitle)}
      description={intl.formatMessage({
        defaultMessage: "Apply now to get started on your IT career journey.",
        id: "Z9W+O2",
        description:
          "Meta tag description for IT Apprenticeship Program for Indigenous Peoples site",
      })}
    />
  );
};

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const location = useLocation();
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
        <Fragment key={location.pathname}>
          <Favicon locale={locale} project="iap" />
          <IAPSeo />
          <SkipLink />
          <div className="flex min-h-screen flex-col">
            <Header />
            <SitewideBanner />
            <IAPNavMenu />
            <main id="main">
              <Outlet />
            </main>
            <Footer />
          </div>
          <ScrollRestoration />
        </Fragment>
      </AnimatePresence>
    </NestedLanguageProvider>
  );
};

Component.displayName = "IAPLayout";

export default Component;
