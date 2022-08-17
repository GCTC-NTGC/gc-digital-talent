import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import { getLocale } from "@common/helpers/localize";
import { Helmet } from "react-helmet";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import {
  useIndigenousApprenticeshipRoutes,
  IndigenousApprenticeshipRoutes,
} from "../indigenousApprenticeshipRoutes";
import Home from "./Home/Home";

const routes = (
  indigenousApprenticeshipPaths: IndigenousApprenticeshipRoutes,
): Routes<RouterResult> => [
  {
    path: indigenousApprenticeshipPaths.home(),
    action: () => ({
      component: <Home />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const indigenousApprenticeshipPaths = useIndigenousApprenticeshipRoutes();

  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    const appInsights = new ApplicationInsights({
      config: {
        connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
      },
    });
    appInsights.loadAppInsights();
    appInsights.trackPageView();
  }

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
        contentRoutes={routes(indigenousApprenticeshipPaths)}
      />
      <Helmet>
        <html lang={getLocale(intl)} />
      </Helmet>
      <Toast />
    </ClientProvider>
  );
};

export default Router;
