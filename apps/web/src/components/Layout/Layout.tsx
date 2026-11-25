import { useIntl } from "react-intl";
import { Outlet } from "react-router";

import { getLocale } from "@gc-digital-talent/i18n";
import { Flourish } from "@gc-digital-talent/ui";

import Footer from "~/components/Footer/Footer";
import Header from "~/components/Header/Header";
import SEO, { Favicon } from "~/components/SEO/SEO";
import useLayoutTheme from "~/hooks/useLayoutTheme";

import IAPNavMenu from "../NavMenu/IAPNavMenu";
import MainNavMenu from "../NavMenu/MainNavMenu";
import type { Project } from "../SEO/Favicon";
import SitewideBanner from "./SitewideBanner";
import SkipLink from "./SkipLink";

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

  return (
    <>
      <Favicon locale={locale} project={project} />
      <SEO title={title} description={description} />
      <SkipLink />
      <div className="flex min-h-screen flex-col">
        <Header />
        <SitewideBanner />
        <Flourish />
        {!iapPersonality ? <MainNavMenu /> : <IAPNavMenu />}
        <main
          id="main"
          // 10rem is header + nav height
          className="min-h-[calc(100vh-10rem))] flex w-full grow flex-col"
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
