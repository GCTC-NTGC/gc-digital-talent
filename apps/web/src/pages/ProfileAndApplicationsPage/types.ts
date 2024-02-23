import { Maybe, PoolCandidate, User } from "@gc-digital-talent/graphql";

type Application = Omit<PoolCandidate, "user">;

export type PartialUser = {
  poolCandidates?: Maybe<Array<Maybe<Application>>>;
} & Omit<User, "poolCandidates">;
