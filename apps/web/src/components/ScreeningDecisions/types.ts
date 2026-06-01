import type {
  AssessmentDecisionLevel,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";

import type { NullableDecision } from "~/utils/assessmentResults";

export interface FormValues {
  assessmentDecision?: NullableDecision | null | undefined;
  justifications?:
    | (AssessmentResultJustification | null | undefined)[]
    | AssessmentResultJustification
    | null
    | undefined;
  assessmentDecisionLevel?: AssessmentDecisionLevel | null | undefined;
  skillDecisionNotes?: string | null | undefined;
}
