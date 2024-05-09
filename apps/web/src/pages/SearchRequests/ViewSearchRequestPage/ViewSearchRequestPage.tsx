import React from "react";

import { Scalars } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

type RouteParams = {
  searchRequestId: Scalars["ID"]["output"];
};

export const SingleSearchRequestPage = () => {
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");

  return <ViewSearchRequestApi searchRequestId={searchRequestId} />;
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.RequestResponder]}>
    <SingleSearchRequestPage />
  </RequireAuth>
);

Component.displayName = "AdminViewSearchRequestPage";

export default SingleSearchRequestPage;
