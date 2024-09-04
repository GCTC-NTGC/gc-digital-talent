import { Scalars } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ViewSearchRequestApi from "./components/ViewSearchRequest";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RouteParams = {
  searchRequestId: Scalars["ID"]["output"];
};

export const SingleSearchRequestPage = () => {
  const { searchRequestId } = useRequiredParams<RouteParams>("searchRequestId");

  return <ViewSearchRequestApi searchRequestId={searchRequestId} />;
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.RequestResponder,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityAdmin,
    ]}
  >
    <SingleSearchRequestPage />
  </RequireAuth>
);

Component.displayName = "AdminViewSearchRequestPage";

export default SingleSearchRequestPage;
