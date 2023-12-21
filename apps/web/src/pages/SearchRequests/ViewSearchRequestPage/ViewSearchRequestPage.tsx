import React from "react";

import { Scalars } from "~/api/generated";
import useRequiredParams from "~/hooks/useRequiredParams";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"];
};

export const SingleSearchRequestPage = () => {
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");

  return <ViewSearchRequestApi searchRequestId={searchRequestId} />;
};

export default SingleSearchRequestPage;
