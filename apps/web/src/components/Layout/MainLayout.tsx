import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration, useSearchParams } from "react-router-dom";

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
import { Project } from "../SEO/Favicon";
import Layout from "./Layout";

export { ErrorBoundary } from "./ErrorBoundary/ErrorBoundary";

export const Component = () => {
  const intl = useIntl();
  useLayoutTheme("default");

  const [searchParams] = useSearchParams();

  const iapPersonality = searchParams.get("personality") === "iap";

  return (
    <Layout
      project="digital-talent"
      title={intl.formatMessage(commonMessages.projectTitle)}
      description={intl.formatMessage({
        defaultMessage:
          "GC Digital Talent is the new recruitment platform for digital and tech jobs in the Government of Canada. Apply now!",
        id: "jRmRd+",
        description: "Meta tag description for Talent Search site",
      })}
      iapPersonality={iapPersonality}
    />
  );
};

Component.displayName = "MainLayout";

export default Component;
