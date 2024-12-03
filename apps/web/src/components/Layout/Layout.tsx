import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router";

import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { Flourish } from "@gc-digital-talent/ui";

import SEO, { Favicon } from "~/components/SEO/SEO";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import useLayoutTheme from "~/hooks/useLayoutTheme";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import SitewideBanner from "./SitewideBanner";
import SkipLink from "./SkipLink";
import MainNavMenu from "../NavMenu/MainNavMenu";
import { Project } from "../SEO/Favicon";

interface LayoutProps {
  project: Project;
  title: string;
  description: string;
  iapPersonality?: boolean;
}

const Layout = ({
  project,
  title,
  description,
  iapPersonality,
}: LayoutProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  useLayoutTheme("default");

  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  return (
    <>
      <Favicon locale={locale} project={project} />
      <SEO title={title} description={description} />
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
          <MainNavMenu />
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

export default Layout;
