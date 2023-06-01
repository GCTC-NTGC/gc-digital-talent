import React from "react";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";
import { useIntl } from "react-intl";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import SearchRequestsTable from "~/components/SearchRequestTable/SearchRequestsTable";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import adminMessages from "~/messages/adminMessages";

export const IndexSearchRequestPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const pageTitle = intl.formatMessage(adminMessages.requests);

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
      label: intl.formatMessage(adminMessages.requests),
      url: routes.searchRequestTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO title={pageTitle} />
      <PageHeader icon={TicketIcon}>{pageTitle}</PageHeader>
      <SearchRequestsTable title={pageTitle} />
    </AdminContentWrapper>
  );
};

export default IndexSearchRequestPage;
