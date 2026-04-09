import {
  type AssessmentDecisionLevel,
  type AssessmentResultJustification,
  type Maybe,
} from "@gc-digital-talent/graphql";

import { type NullableDecision } from "~/utils/assessmentResults";

export interface FormValues {
  assessmentDecision?: Maybe<NullableDecision>;
  justifications?:
    | Maybe<Maybe<AssessmentResultJustification>[]>
    | Maybe<AssessmentResultJustification>;
  assessmentDecisionLevel?: Maybe<AssessmentDecisionLevel>;
  skillDecisionNotes?: Maybe<string>;
}
