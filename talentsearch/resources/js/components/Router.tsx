import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "../helpers/router";
import ClientProvider from "./ClientProvider";
import ErrorContainer from "./ErrorContainer";
import { Container, MenuLink } from "./PageContainer";
import SearchPage from "./search/SearchPage";
import { homePath, searchPath } from "../talentSearchRoutes";
import HomePage from "./HomePage";

const messages = defineMessages({
  menuHome: {
    id: "talentSearch.menu.homeLabel",
    defaultMessage: "Home",
    description: "Label displayed on the Home menu item.",
  },
  menuSearch: {
    id: "talentSearch.menu.searchLabel",
    defaultMessage: "Search",
    description: "Label displayed on the Search menu item.",
  },
});

const routes: Routes<RouterResult> = [
  {
    path: homePath(),
    action: () => ({
      component: <HomePage />,
    }),
  },
  {
    path: searchPath(),
    action: () => ({
      component: <SearchPage />,
    }),
  },
];

export const Router: React.FC = () => {
  const intl = useIntl();

  const menuItems = [
    <MenuLink
      key="home"
      href={homePath()}
      text={intl.formatMessage(messages.menuHome)}
    />,
    <MenuLink
      key="search"
      href={searchPath()}
      text={intl.formatMessage(messages.menuSearch)}
    />,
  ];

  return (
    <ErrorContainer>
      <ClientProvider>
        <Container menuItems={menuItems} contentRoutes={routes} />
      </ClientProvider>
    </ErrorContainer>
  );
};

export default Router;
