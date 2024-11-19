import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import { DashboardPageApi } from "../AdminDashboardPage/AdminDashboardPage";

export const Component = () => (
  <RequireAuth roles={permissionConstants().viewCommunities}>
    <DashboardPageApi />
  </RequireAuth>
);

Component.displayName = "CommunityDashboardPage";

export default DashboardPageApi;
