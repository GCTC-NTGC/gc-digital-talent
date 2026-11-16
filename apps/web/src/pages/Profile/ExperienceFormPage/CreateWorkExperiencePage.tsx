import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CreateExperienceTypeFormContainer from "./CreateExperienceTypeFormPage";

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CreateExperienceTypeFormContainer experienceType="work" />
  </RequireAuth>
);

Component.displayName = "CreateWorkExperiencePage";

export default Component;
