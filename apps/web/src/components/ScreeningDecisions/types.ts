import type {
  AssessmentDecisionLevel,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";

import type { NullableDecision } from "~/utils/assessmentResults";

export interface FormValues {
  assessmentDecision?: NullableDecision | null;
  justifications?:
    | (AssessmentResultJustification | null | undefined)[]
    | AssessmentResultJustification
    | null;
  assessmentDecisionLevel?: AssessmentDecisionLevel | null;
  skillDecisionNotes?: string | null;
}
