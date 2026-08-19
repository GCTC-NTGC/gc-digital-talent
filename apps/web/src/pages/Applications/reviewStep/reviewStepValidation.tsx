import type { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";

import type { ApplicationStepPool } from "~/types/applicationStep";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  _pool: ApplicationStepPool,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return !application.signature;
};

export default stepHasError;
