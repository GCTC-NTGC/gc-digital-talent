import {
  Classification,
  Maybe,
  Pool,
  PoolCandidate,
  Team,
} from "@gc-digital-talent/graphql";

export type PoolStatusTablePoolCandidate = Pick<
  PoolCandidate,
  "id" | "suspendedAt" | "expiryDate" | "status"
> & {
  pool: Pick<
    Pool,
    "id" | "stream" | "publishingGroup" | "processNumber" | "name"
  > & { team?: Maybe<Pick<Team, "id" | "displayName">> } & {
    classification?: Maybe<Pick<Classification, "id" | "group" | "level">>;
  };
};
