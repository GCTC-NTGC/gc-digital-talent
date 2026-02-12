import {
  Pool,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  _pool: Omit<Pool, "activities" | "teamId">,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return !application.signature;
};

export default stepHasError;
