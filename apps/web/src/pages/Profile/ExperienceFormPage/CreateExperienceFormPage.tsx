import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceFormContainer from "./ExperienceFormPage";

export const Component = () => (
  <RequireAuth roles={permissionConstants().isApplicant}>
    <ExperienceFormContainer />
  </RequireAuth>
);

Component.displayName = "CreateExperienceFormPage";

export default Component;
