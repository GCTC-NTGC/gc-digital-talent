import React from "react";
import { useIntl } from "react-intl";

import SEO from "~/components/SEO/SEO";
import { Scalars } from "~/api/generated";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminHero from "~/components/Hero/AdminHero";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"];
};

export const SingleSearchRequestPage = () => {
  const intl = useIntl();
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");
  const pageTitle = intl.formatMessage({
    defaultMessage: "Request",
    id: "WYJnLs",
    description: "Heading displayed above the single search request component.",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <AdminHero title={pageTitle} />
      <ViewSearchRequestApi searchRequestId={searchRequestId} />
    </>
  );
};

export default SingleSearchRequestPage;
