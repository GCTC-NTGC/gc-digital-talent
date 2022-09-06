import React from "react";
import { TicketIcon } from "@heroicons/react/outline";
import { useIntl } from "react-intl";

import PageHeader from "@common/components/PageHeader";

import DashboardContentContainer from "../DashboardContentContainer";
import { SearchRequestTableApi } from "./SearchRequestTable";

export const SearchRequestPage: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <DashboardContentContainer>
      <PageHeader icon={TicketIcon}>
        {intl.formatMessage({
          defaultMessage: "All Requests",
          description: "Heading displayed above the search request component.",
        })}
      </PageHeader>

      <SearchRequestTableApi />
    </DashboardContentContainer>
  );
};

export default SearchRequestPage;
