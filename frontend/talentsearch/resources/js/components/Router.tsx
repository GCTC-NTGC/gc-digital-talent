import React from "react";
import { useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "@common/helpers/router";
import Toast from "@common/components/Toast";
import ClientProvider from "./ClientProvider";
import PageContainer, { MenuLink } from "./PageContainer";
import SearchPage from "./search/SearchPage";
import {
  useTalentSearchRoutes,
  TalentSearchRoutes,
} from "../talentSearchRoutes";
import RequestPage from "./request/RequestPage";
import { ProfilePageApi } from "./profile/ProfilePage/ProfilePage";

const routes = (paths: TalentSearchRoutes): Routes<RouterResult> => [
  {
    path: paths.home(),
    action: () => ({
      component: <div />,
      redirect: paths.search(),
    }),
  },
  {
    path: paths.search(),
    action: () => ({
      component: <SearchPage />,
    }),
  },
  {
    path: paths.request(),
    action: () => ({
      component: <RequestPage />,
    }),
  },
  {
    path: paths.profile(),
    action: () => ({
      component: <ProfilePageApi />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();
  const paths = useTalentSearchRoutes();

  const menuItems = [
    <MenuLink
      key="search"
      href={paths.search()}
      text={intl.formatMessage({
        defaultMessage: "Search",
        description: "Label displayed on the Search menu item.",
      })}
    />,
    <MenuLink
      key="request"
      href={paths.request()}
      text={intl.formatMessage({
        defaultMessage: "Request",
        description: "Label displayed on the Request menu item.",
      })}
    />,
  ];

  return (
    <ClientProvider>
      <PageContainer menuItems={menuItems} contentRoutes={routes(paths)} />
      <Toast />
    </ClientProvider>
  );
};

export default Router;
