import type { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";
import { EducationRequirementOption } from "@gc-digital-talent/graphql";

import type { ApplicationStepPool } from "~/types/applicationStep";
import type { ExperienceForDate } from "~/types/experience";
import { isEducationExperience } from "~/utils/experienceUtils";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  _pool: ApplicationStepPool,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return (
    !application.educationRequirementOption ||
    !application.educationRequirementExperiences ||
    ((application.educationRequirementOption.value ===
      EducationRequirementOption.AppliedWork ||
      application.educationRequirementOption.value ===
        EducationRequirementOption.ProfessionalDesignation) &&
      application.educationRequirementExperiences.length === 0) ||
    (application.educationRequirementOption.value ===
      EducationRequirementOption.Education &&
      application.educationRequirementExperiences.filter((experience) =>
        isEducationExperience(experience as ExperienceForDate),
      ).length === 0)
  );
};

export default stepHasError;
