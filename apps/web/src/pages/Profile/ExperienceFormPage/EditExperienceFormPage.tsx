import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceFormContainer from "./ExperienceFormPage";

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ExperienceFormContainer edit />
  </RequireAuth>
);

Component.displayName = "EditExperienceFormPage";

export default Component;
