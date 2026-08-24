import type { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";

import type { ApplicationStepPool } from "~/types/applicationStep";
import {
  generalQuestionsSectionHasMissingResponses,
  screeningQuestionsSectionHasMissingResponses,
} from "~/validators/profile";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  pool: ApplicationStepPool,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return (
    generalQuestionsSectionHasMissingResponses(application, pool) ||
    screeningQuestionsSectionHasMissingResponses(application, pool)
  );
};

export default stepHasError;
