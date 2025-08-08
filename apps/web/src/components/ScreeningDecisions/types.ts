import {
  AssessmentDecisionLevel,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";

import { NullableDecision } from "~/utils/assessmentResults";

export interface FormValues {
  assessmentDecision?: NullableDecision;
  justifications?:
    | AssessmentResultJustification[]
    | AssessmentResultJustification;
  assessmentDecisionLevel?: AssessmentDecisionLevel;
  skillDecisionNotes?: string;
}
