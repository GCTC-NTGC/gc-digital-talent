import type { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import type { ApplicationStepPool } from "~/types/applicationStep";
import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (
  user: ApplicationPoolCandidateFragmentType["user"],
  pool: ApplicationStepPool,
) => {
  const applicantExperiences = user?.experiences?.filter(notEmpty);
  return skillRequirementsIsIncomplete(applicantExperiences, pool);
};

export default stepHasError;
