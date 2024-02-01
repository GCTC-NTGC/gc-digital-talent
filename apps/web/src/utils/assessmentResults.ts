import { AssessmentDecision } from "@gc-digital-talent/graphql";

export const NO_DECISION = "noDecision";

export type NullableDecision = AssessmentDecision | typeof NO_DECISION;
