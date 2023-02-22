import React from "react";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import PageHeader from "~/components/PageHeader";
import SEO from "~/components/SEO/SEO";

import SearchRequestTableApi from "~/components/SearchRequestTable/SearchRequestTable";

export const IndexSearchRequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <>
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
    </>
  );
};

export default IndexSearchRequestPage;
