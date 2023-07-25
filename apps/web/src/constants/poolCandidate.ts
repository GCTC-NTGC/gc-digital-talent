import { PoolCandidateStatus } from "~/api/generated";

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

export const PLACED_STATUSES = [
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedIndeterminate,
];

export const SCREENED_OUT_STATUSES = [
  PoolCandidateStatus.ScreenedOutApplication,
  PoolCandidateStatus.ScreenedOutAssessment,
  PoolCandidateStatus.ScreenedOutNotInterested,
  PoolCandidateStatus.ScreenedOutNotResponsive,
];
