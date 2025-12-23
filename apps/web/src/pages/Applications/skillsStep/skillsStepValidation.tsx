import {
  Pool,
  Experience,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (
  user: ApplicationPoolCandidateFragmentType["user"],
  pool: Omit<Pool, "activities">,
) => {
  const applicantExperiences: Omit<Experience, "user">[] | undefined =
    user?.experiences?.filter(notEmpty);
  return skillRequirementsIsIncomplete(applicantExperiences, pool);
};

export default stepHasError;
