import {
  Pool,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

import {
  generalQuestionsSectionHasMissingResponses,
  screeningQuestionsSectionHasMissingResponses,
} from "~/validators/profile";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  pool: Omit<Pool, "activities">,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return (
    generalQuestionsSectionHasMissingResponses(application, pool) ||
    screeningQuestionsSectionHasMissingResponses(application, pool)
  );
};

export default stepHasError;
