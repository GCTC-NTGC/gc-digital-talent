import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import { Heading } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import { Scalars } from "~/api/generated";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"];
};

export const SingleSearchRequestPage = () => {
  const intl = useIntl();
  const { searchRequestId } = useParams<RouteParams>();
  const pageTitle = intl.formatMessage({
    defaultMessage: "View Request",
    id: "HkC8XB",
    description: "Heading displayed above the single search request component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      {/* This is above the AdminContentWrapper so it needs its own centering */}
      <div data-h2-container="base(center, full, x2)">
        <header>
          <Heading level="h1" size="h2">
            {pageTitle}
          </Heading>
        </header>
      </div>
      <ViewSearchRequestApi searchRequestId={searchRequestId || ""} />
    </>
  );
};

export default SingleSearchRequestPage;
