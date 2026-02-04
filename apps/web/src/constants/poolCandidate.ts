import {
  AssessmentStepType,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

export const QUALIFIED_STATUSES = [
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
  PoolCandidateStatus.UnderConsideration,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedTerm,
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.Expired,
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
  PoolCandidateStatus.Removed,
  PoolCandidateStatus.Expired,
];

export const DRAFT_STATUSES = [
  PoolCandidateStatus.Draft,
  PoolCandidateStatus.DraftExpired,
];

export const TO_ASSESS_STATUSES = [
  PoolCandidateStatus.NewApplication,
  PoolCandidateStatus.ApplicationReview,
  PoolCandidateStatus.ScreenedIn,
  PoolCandidateStatus.UnderAssessment,
];

export const PLACED_STATUSES = [
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTerm,
];

export const NOT_PLACED_STATUSES = [
  PoolCandidateStatus.UnderConsideration,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.QualifiedAvailable,
];

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

/** Applicant facing */
export const INACTIVE_STATUSES = [
  PoolCandidateStatus.QualifiedUnavailable,
  PoolCandidateStatus.QualifiedWithdrew,
];

export const SUSPENDABLE_STATUSES = [
  PoolCandidateStatus.QualifiedAvailable,
  PoolCandidateStatus.PlacedCasual,
];

export const PLACEMENT_TYPE_STATUSES = [
  PoolCandidateStatus.UnderConsideration,
  PoolCandidateStatus.PlacedCasual,
  PoolCandidateStatus.PlacedIndeterminate,
  PoolCandidateStatus.PlacedTentative,
  PoolCandidateStatus.PlacedTerm,
];

// NOTE: We intend to remove these at some point
export const LEGACY_ASSESSMENT_STEP_TYPES = [
  AssessmentStepType.ApplicationScreening,
  AssessmentStepType.ScreeningQuestionsAtApplication,
];
