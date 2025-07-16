import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router";
import { useState } from "react";

import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { Flourish, useAnnouncer } from "@gc-digital-talent/ui";

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
  const { announce } = useAnnouncer();
  const [val, setVal] = useState<number>(0);

  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const handleClick = () => {
    setVal((curr) => {
      return curr + 1;
    });

    announce(`Clicked ${val + 1} times`);

  }

  return (
    <>
      <Favicon locale={locale} project={project} />
      <SEO title={title} description={description} />
      <SkipLink />
      <div className="flex min-h-screen flex-col">
        <Header />
        <SitewideBanner />
        <Flourish />
        {!iapPersonality ? (
          <MainNavMenu />
        ) : (
          <IAPNavMenu {...{ loggedIn, userAuthInfo }} />
        )}
        <main id="main">
          <button onClick={handleClick}>Announce</button>
          <Outlet />
        </main>
        <Footer />
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
