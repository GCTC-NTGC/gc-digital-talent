import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "../helpers/router";
import ClientProvider from "./ClientProvider";
import ErrorContainer from "./ErrorContainer";
import { Dashboard, MenuLink } from "./Dashboard";

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
    action: ({}) => ({
      component: <div>Placeholder Home content.</div>,
    }),
  },
  {
    path: "/page1",
    action: () => ({
      component: <div>Placeholder Page 1 content.</div>,
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
    <MenuLink key="page1" href="/page1" text="Page 1" />,
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
