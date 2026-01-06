import {
  Pool,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  _pool: Omit<Pool, "activities">,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return !application.signature;
};

export default stepHasError;
