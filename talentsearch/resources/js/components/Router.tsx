import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import { getLocale } from "@common/helpers/localize";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import SearchPage from "./search/SearchPage";
import { homePath, requestPath, searchPath } from "../talentSearchRoutes";
import HomePage from "./HomePage";
import RequestPage from "./request/RequestPage";

const routes: Routes<RouterResult> = [
  {
    path: homePath(":lang"),
    action: ({ params }) => ({
      component: <HomePage lang={params.lang as string} />,
    }),
  },
  {
    path: searchPath(":lang"),
    action: ({ params }) => ({
      component: <SearchPage lang={params.lang as string} />,
    }),
  },
  {
    path: requestPath(":lang"),
    action: ({ params }) => ({
      component: <RequestPage lang={params.lang as string} />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();

  const menuItems = [
    <MenuLink
      key="home"
      href={homePath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Home",
        description: "Label displayed on the Home menu item.",
      })}
    />,
    <MenuLink
      key="search"
      href={searchPath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Search",
        description: "Label displayed on the Search menu item.",
      })}
    />,
    <MenuLink
      key="request"
      href={requestPath(getLocale(intl))}
      text={intl.formatMessage({
        defaultMessage: "Request",
        description: "Label displayed on the Request menu item.",
      })}
    />,
  ];

  return (
    <ClientProvider>
      <PageContainer menuItems={menuItems} contentRoutes={routes} />
      <Toast />
    </ClientProvider>
  );
};

export default Router;
