import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useFeatureFlags } from "@gc-digital-talent/env";

import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ExperienceFormContainer from "./ExperienceFormPage";
import EditExperienceTypeFormContainer from "./EditExperienceTypeFormPage";

export const Component = () => {
  const { careerExperience } = useFeatureFlags();

  return (
    <RequireAuth roles={[ROLE_NAME.Applicant]}>
      {careerExperience ? (
        <EditExperienceTypeFormContainer />
      ) : (
        <ExperienceFormContainer edit />
      )}
    </RequireAuth>
  );
};

Component.displayName = "EditExperienceFormPage";

export default Component;
