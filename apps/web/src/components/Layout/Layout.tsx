import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration, useSearchParams } from "react-router-dom";

import { Flourish } from "@gc-digital-talent/ui";
import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { commonMessages, getLocale } from "@gc-digital-talent/i18n";

import SEO, { Favicon } from "~/components/SEO/SEO";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import useLayoutTheme from "~/hooks/useLayoutTheme";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import SitewideBanner from "./SitewideBanner";
import SkipLink from "./SkipLink";
import SiteNavMenu from "../NavMenu/MainNavMenu";

export { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  useLayoutTheme("default");

  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

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
