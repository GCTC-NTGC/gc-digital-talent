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
      <div data-h2-padding="base(0, 0, x3, 0)">
        <div data-h2-container="base(center, large, x2)">
          <header>
            <Heading level="h1" size="h2">
              {pageTitle}
            </Heading>
          </header>
          <ViewSearchRequestApi searchRequestId={searchRequestId || ""} />
        </div>
      </div>
    </>
  );
};

export default SingleSearchRequestPage;
