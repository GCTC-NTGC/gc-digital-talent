import { Maybe, PoolCandidate, User } from "~/api/generated";

export type Application = Omit<PoolCandidate, "pool" | "user">;

export type PartialUser = {
  poolCandidates?: Maybe<Array<Maybe<Application>>>;
} & Omit<User, "poolCandidates">;
