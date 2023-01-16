import React from "react";
import { TicketIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";

import DashboardContentContainer from "../DashboardContentContainer";
import { SearchRequestTableApi } from "./SearchRequestTable";

export const SearchRequestPage: React.FunctionComponent = () => {
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
      <DashboardContentContainer>
        <PageHeader icon={TicketIcon}>
          {intl.formatMessage({
            defaultMessage: "All Requests",
            id: "IfWj5I",
            description:
              "Heading displayed above the search request component.",
          })}
        </PageHeader>

        <SearchRequestTableApi />
      </DashboardContentContainer>
    </>
  );
};

export default SearchRequestPage;
