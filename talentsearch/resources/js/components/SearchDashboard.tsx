import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "../helpers/router";
import ClientProvider from "./ClientProvider";
import ErrorContainer from "./ErrorContainer";
import { Dashboard, MenuLink } from "./Dashboard";
import SearchPage from "./search/SearchPage";

const messages = defineMessages({
  menuHome: {
    id: "talentSearch.menu.homeLabel",
    defaultMessage: "Home",
    description: "Label displayed on the Home menu item.",
  },
});

const routes: Routes<RouterResult> = [
  {
    path: "/",
    action: () => ({
      component: <div>Placeholder Home content.</div>,
    }),
  },
  {
    path: "/search",
    action: () => ({
      component: <SearchPage />,
    }),
  },
];

export const SearchDashboard: React.FC = () => {
  const intl = useIntl();

  const menuItems = [
    <MenuLink
      key="home"
      href="/"
      text={intl.formatMessage(messages.menuHome)}
    />,
    <MenuLink key="search" href="/search" text="Search" />,
  ];

  return (
    <ErrorContainer>
      <ClientProvider>
        <Dashboard menuItems={menuItems} contentRoutes={routes} />
      </ClientProvider>
    </ErrorContainer>
  );
};

export default SearchDashboard;
