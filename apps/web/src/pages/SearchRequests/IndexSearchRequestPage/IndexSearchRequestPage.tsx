import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import SearchRequestTable from "~/components/SearchRequestTable/SearchRequestTable";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import AdminHero from "~/components/Hero/AdminHero";

import { pageTitle } from "./navigation";

export const IndexSearchRequestPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "EBmWyo",
        description: "Link text for the home link in breadcrumbs.",
      }),
      url: routes.adminDashboard(),
    },
    {
      label: formattedPageTitle,
      url: routes.searchRequestTable(),
    },
  ];

  return (
    <>
      <SEO title={formattedPageTitle} />
      <AdminHero
        title={formattedPageTitle}
        nav={{ mode: "crumbs", items: navigationCrumbs }}
      />
      <AdminContentWrapper>
        <SearchRequestTable title={formattedPageTitle} />
      </AdminContentWrapper>
    </>
  );
};

export default IndexSearchRequestPage;
