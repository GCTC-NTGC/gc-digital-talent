import { PoolCandidateSearchStatus } from "@gc-digital-talent/graphql";

export function stringToEnumRequestStatus(
  selection: string,
): PoolCandidateSearchStatus | undefined {
  if (
    Object.values(PoolCandidateSearchStatus).includes(
      selection as PoolCandidateSearchStatus,
    )
  ) {
    return selection as PoolCandidateSearchStatus;
  }
  return undefined;
}
