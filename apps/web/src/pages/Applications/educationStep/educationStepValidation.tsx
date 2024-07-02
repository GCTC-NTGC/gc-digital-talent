import {
  User,
  EducationRequirementOption,
  Pool,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import { ExperienceForDate } from "~/types/experience";
import { isEducationExperience } from "~/utils/experienceUtils";

const stepHasError = (
  _user: User,
  _pool: Pool,
  application: Omit<PoolCandidate, "pool">,
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
