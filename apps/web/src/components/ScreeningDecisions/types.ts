import {
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  Maybe,
} from "@gc-digital-talent/graphql";

import { NullableDecision } from "~/utils/assessmentResults";

export interface FormValues {
  assessmentDecision?: Maybe<NullableDecision>;
  justifications?:
    | Maybe<Maybe<AssessmentResultJustification>[]>
    | Maybe<AssessmentResultJustification>;
  assessmentDecisionLevel?: Maybe<AssessmentDecisionLevel>;
  skillDecisionNotes?: Maybe<string>;
}
