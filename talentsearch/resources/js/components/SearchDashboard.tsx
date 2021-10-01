import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { RouterResult } from "../helpers/router";
import ClientProvider from "./ClientProvider";
import ErrorContainer from "./ErrorContainer";
import { Dashboard, MenuLink } from "./Dashboard";
import SearchPage from "./search/SearchPage";
import { homePath, searchDashboardPath } from "../talentSearchRoutes";

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
      component: (
        <div data-h2-flex-grid="b(middle, contained, flush, xl)">
          <div
            data-h2-flex-item="b(1of1) m(1of2)"
            data-h2-text-align="b(center) m(left)"
          >
            Placeholder Home content.
          </div>
        </div>
      ),
    }),
  },
  {
    path: searchDashboardPath(),
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
      href={homePath()}
      text={intl.formatMessage(messages.menuHome)}
    />,
    <MenuLink
      key="search"
      href={searchDashboardPath()}
      text={intl.formatMessage(messages.menuSearch)}
    />,
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
