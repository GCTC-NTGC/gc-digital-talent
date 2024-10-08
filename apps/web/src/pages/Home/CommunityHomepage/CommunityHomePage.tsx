import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CommunityHomePage from "../HomePage/HomePage";

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.RequestResponder,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <CommunityHomePage />
  </RequireAuth>
);

Component.displayName = "CommunityHomePage";

export default Component;
