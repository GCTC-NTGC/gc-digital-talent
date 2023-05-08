import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import SEO from "~/components/SEO/SEO";
import { Scalars } from "~/api/generated";

import PageHeader from "~/components/PageHeader";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";
import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"];
};

export const SingleSearchRequestPage = () => {
  const intl = useIntl();
  const { searchRequestId } = useParams<RouteParams>();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Request",
    id: "WYJnLs",
    description: "Heading displayed above the single search request component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      {/* This is above the AdminContentWrapper so it needs its own centering */}
      <div data-h2-container="base(center, full, x2)">
        <header>
          <PageHeader icon={TicketIcon}>{pageTitle}</PageHeader>
        </header>
      </div>

      <ViewSearchRequestApi
        searchRequestId={searchRequestId || ""}
        title={pageTitle}
      />
    </>
  );
};

export default SingleSearchRequestPage;
