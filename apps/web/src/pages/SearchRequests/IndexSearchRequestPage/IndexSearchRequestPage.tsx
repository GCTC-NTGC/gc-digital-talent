import React from "react";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";
import SearchRequestTableApi from "~/components/SearchRequestTable/SearchRequestTable";
import useRoutes from "~/hooks/useRoutes";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

export const IndexSearchRequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const navigationCrumbs = [
    {
      label: intl.formatMessage({
        defaultMessage: "Home",
        id: "DUK/pz",
        description: "Breadcrumb title for the home page link.",
      }),
      url: routes.admin(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Requests",
        id: "y0j4oU",
        description:
          "Breadcrumb title for the search requests table page link.",
      }),
      url: routes.searchRequestTable(),
    },
  ];

  return (
    <AdminContentWrapper crumbs={navigationCrumbs}>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Talent requests",
          id: "+4Zmyc",
          description: "Page title for the search request index page",
        })}
      />
      <PageHeader icon={TicketIcon}>
        {intl.formatMessage({
          defaultMessage: "All Requests",
          id: "IfWj5I",
          description: "Heading displayed above the search request component.",
        })}
      </PageHeader>
      <SearchRequestTableApi />
    </AdminContentWrapper>
  );
};

export default IndexSearchRequestPage;
