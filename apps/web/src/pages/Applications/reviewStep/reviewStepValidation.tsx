import {
  Pool,
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
} from "@gc-digital-talent/graphql";

const stepHasError = (
  _user: ApplicationPoolCandidateFragmentType["user"],
  _pool: Pool,
  application: ApplicationPoolCandidateFragmentType,
) => {
  return !application.signature;
};

export default stepHasError;
