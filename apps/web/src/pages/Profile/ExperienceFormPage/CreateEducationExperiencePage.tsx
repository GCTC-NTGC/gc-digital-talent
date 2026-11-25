import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import CreateExperienceTypeFormContainer from "./CreateExperienceTypeFormPage";

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.BaseUser]}>
    <CreateExperienceTypeFormContainer experienceType="education" />
  </RequireAuth>
);

Component.displayName = "CreateEducationExperiencePage";

export default Component;
