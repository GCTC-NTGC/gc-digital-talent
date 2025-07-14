import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router";
import { configureEcho, useEchoNotification } from "@laravel/echo-react";

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

const getToken = () => localStorage.getItem("access_token") ?? "";

console.log(getToken());

configureEcho({
  broadcaster: "reverb",
  key: "gcdtReverbKey",
  wsHost: "localhost",
  wsPort: "6001",
  forceTLS: false,
  enabledTransports: ["ws"],
  auth: {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    },
  },
});

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
  const auth = useAuthorization();
  useLayoutTheme("default");

  const { userAuthInfo } = useAuthorization();
  const { loggedIn } = useAuthentication();

  const userId = auth.userAuthInfo?.id;
  console.log(userId);

  useEchoNotification(`App.Models.User.${userId}`, (notification) => {
    console.log(notification);
  });

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
