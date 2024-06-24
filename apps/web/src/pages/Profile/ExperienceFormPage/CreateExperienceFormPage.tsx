import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceFormContainer from "./ExperienceFormPage";

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <ExperienceFormContainer />
  </RequireAuth>
);

Component.displayName = "CreateExperienceFormPage";

export default Component;
