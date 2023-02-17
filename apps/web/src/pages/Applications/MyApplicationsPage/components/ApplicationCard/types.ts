import { PoolCandidate } from "~/api/generated";

export type Application = Omit<PoolCandidate, "pool" | "user">;
