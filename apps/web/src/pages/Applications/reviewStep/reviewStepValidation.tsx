import { User, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

const stepHasError = (
  _user: User,
  _pool: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return !application.signature;
};

export default stepHasError;
