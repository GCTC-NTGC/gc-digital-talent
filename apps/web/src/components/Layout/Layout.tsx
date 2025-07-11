import { useIntl } from "react-intl";
import { Outlet, ScrollRestoration } from "react-router";
import { useSubscription } from "urql";

import { useAuthentication, useAuthorization } from "@gc-digital-talent/auth";
import { getLocale } from "@gc-digital-talent/i18n";
import { Flourish } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";

import SEO, { Favicon } from "~/components/SEO/SEO";
import Header from "~/components/Header/Header";
import Footer from "~/components/Footer/Footer";
import useLayoutTheme from "~/hooks/useLayoutTheme";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import SitewideBanner from "./SitewideBanner";
import SkipLink from "./SkipLink";
import MainNavMenu from "../NavMenu/MainNavMenu";
import { Project } from "../SEO/Favicon";

const NotificationSent_Subscription = graphql(/** GraphQL */ `
  subscription NotificationSent {
    notificationSent {
      id
      ... on UserFileGeneratedNotification {
        id
        fileName
        createdAt
      }
    }
  }
`);

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

  const socket = new WebSocket(
    "ws://localhost:6001/gcdtReverbKey?protocol=7&client=js&version=7.0.3",
  );

  // Log successful connection
  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  // Log errors
  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  // Log disconnects
  socket.onclose = (event) => {
    console.log("⚠️ WebSocket closed:", event);
  };

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
