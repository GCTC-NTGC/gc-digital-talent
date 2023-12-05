import { User, Pool, PoolCandidate } from "~/api/generated";

const stepHasError = (
  _user: User,
  _pool: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return !application.signature;
};

export default stepHasError;
