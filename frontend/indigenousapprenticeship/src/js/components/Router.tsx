import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import {
  getLocale,
  Locales,
  localizePath,
  oppositeLocale,
} from "@common/helpers/localize";
import { Helmet } from "react-helmet";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import {
  useIndigenousApprenticeshipRoutes,
  IndigenousApprenticeshipRoutes,
} from "../indigenousApprenticeshipRoutes";
import Home from "./Home/Home";

const routes = (
  indigenousApprenticeshipPaths: IndigenousApprenticeshipRoutes,
  locale: Locales,
): Routes<RouterResult> => [
  {
    path: indigenousApprenticeshipPaths.home(),
    action: () => ({
      component: <Home />,
    }),
  },
  {
    path: indigenousApprenticeshipPaths.frenchURL(),
    action: () => ({
      component: <div />,
      redirect: localizePath(
        indigenousApprenticeshipPaths.home(),
        oppositeLocale(locale),
      ),
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const indigenousApprenticeshipPaths = useIndigenousApprenticeshipRoutes();

  const menuItems = [
    <MenuLink
      key="home"
      href={indigenousApprenticeshipPaths.home()}
      text={intl.formatMessage({
        defaultMessage: "Home",
        description:
          "Link to the homepage for indigenous apprenticeship program.",
      })}
    />,
  ];

  return (
    <ClientProvider>
      <PageContainer
        menuItems={menuItems}
        contentRoutes={routes(indigenousApprenticeshipPaths, locale)}
      />
      <Helmet>
        <html lang={locale} />
      </Helmet>
      <Toast />
    </ClientProvider>
  );
};

export default Router;
