import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceFormContainer from "./ExperienceFormPage";

export const Component = () => (
  <RequireAuth roles={permissionConstants().isApplicant}>
    <ExperienceFormContainer edit />
  </RequireAuth>
);

Component.displayName = "EditExperienceFormPage";

export default Component;
