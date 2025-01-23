import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import ExperienceFormContainer from "./ExperienceFormPage";

export const Component = () => (
  <RequireAuth roles={permissionConstants.isApplicant}>
    <ExperienceFormContainer edit />
  </RequireAuth>
);

Component.displayName = "EditExperienceFormPage";

export default Component;
