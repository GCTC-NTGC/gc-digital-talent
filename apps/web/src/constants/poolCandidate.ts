import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

export const QUALIFIED_STATUSES = [
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedIndeterminate,
];

export const DISQUALIFIED_STATUSES = [
  PoolCandidateStatus.ScreenedOutApplication,
  PoolCandidateStatus.ScreenedOutAssessment,
];

export const REMOVED_STATUSES = [
  PoolCandidateStatus.ScreenedOutNotInterested,
  PoolCandidateStatus.ScreenedOutNotResponsive,
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
  PoolCandidateStatus.Expired,
  PoolCandidateStatus.Removed,
];

export const TO_ASSESS_STATUSES = [
  PoolCandidateStatus.Draft,
  PoolCandidateStatus.DraftExpired,
  PoolCandidateStatus.NewApplication,
  PoolCandidateStatus.ApplicationReview,
  PoolCandidateStatus.ScreenedIn,
  PoolCandidateStatus.UnderAssessment,
];

export const PLACED_STATUSES = [
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedTentative,
];

export const NOT_PLACED_STATUSES = [PoolCandidateStatus.QualifiedAvailable];

export const RECORD_DECISION_STATUSES = [
  PoolCandidateStatus.NewApplication,
  PoolCandidateStatus.ApplicationReview,
  PoolCandidateStatus.ScreenedIn,
  PoolCandidateStatus.UnderAssessment,
];

export const REVERT_DECISION_STATUSES = [
  PoolCandidateStatus.ScreenedOutApplication,
  PoolCandidateStatus.ScreenedOutAssessment,
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.Expired,
];
