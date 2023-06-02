import { Applicant, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

const stepHasError = (
  _applicant: Applicant,
  _pool: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return !application.signature;
};

export default stepHasError;
