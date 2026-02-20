import {
  ApplicationStatus,
  AssessmentStepType,
} from "@gc-digital-talent/graphql";

export const REVERT_DECISION_STATUSES = [
  ApplicationStatus.Qualified,
  ApplicationStatus.Disqualified,
];
//
// NOTE: We intend to remove these at some point
export const LEGACY_ASSESSMENT_STEP_TYPES = [
  AssessmentStepType.ApplicationScreening,
  AssessmentStepType.ScreeningQuestionsAtApplication,
];
