import { Scalars } from "@gc-digital-talent/graphql";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

interface RouteParams extends Record<string, string> {
  searchRequestId: Scalars["ID"]["output"];
}

export const SingleSearchRequestPage = () => {
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");

  return <ViewSearchRequestApi searchRequestId={searchRequestId} />;
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewRequests}>
    <SingleSearchRequestPage />
  </RequireAuth>
);

Component.displayName = "AdminViewSearchRequestPage";

export default SingleSearchRequestPage;
