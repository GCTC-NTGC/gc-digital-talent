import React from "react";

import { Scalars } from "@gc-digital-talent/graphql";

import useRequiredParams from "~/hooks/useRequiredParams";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"]["output"];
};

export const SingleSearchRequestPage = () => {
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");

  return <ViewSearchRequestApi searchRequestId={searchRequestId} />;
};

export default SingleSearchRequestPage;
