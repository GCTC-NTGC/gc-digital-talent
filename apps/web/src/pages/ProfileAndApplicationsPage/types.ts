import { Maybe, PoolCandidate, User } from "~/api/generated";

type Application = Omit<PoolCandidate, "user">;

export type PartialUser = {
  poolCandidates?: Maybe<Array<Maybe<Application>>>;
} & Omit<User, "poolCandidates">;
