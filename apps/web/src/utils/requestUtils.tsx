import {
  PoolCandidateSearchStatus,
  PoolStream,
} from "@gc-digital-talent/graphql";

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

export function stringToEnumStream(selection: string): PoolStream | undefined {
  if (Object.values(PoolStream).includes(selection as PoolStream)) {
    return selection as PoolStream;
  }
  return undefined;
}
