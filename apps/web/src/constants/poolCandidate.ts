import { PoolCandidateStatus, PublishingGroup } from "~/api/generated";

export const QUALIFIED_STATUSES = [
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedIndeterminate,
];

export const EXPIRED_STATUSES = [
  PoolCandidateStatus.DraftExpired,
  PoolCandidateStatus.Expired,
];

export const ONGOING_PUBLISHING_GROUPS = [PublishingGroup.ItJobsOngoing];
