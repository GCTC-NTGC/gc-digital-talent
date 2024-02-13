import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";

import {
  AssessmentResult,
  AssessmentStep,
  PoolCandidate,
  PoolSkill,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

export type AssessmentStepResult = {
  poolSkill?: PoolSkill;
  assessmentResults: AssessmentResult[];
};

export type AssessmentStepResultColumn = ColumnDef<AssessmentStepResult>;

export type AssessmentStepResultColumnProps = {
  id: string;
  poolCandidate: PoolCandidate;
  assessmentStep: AssessmentStep;
  intl: IntlShape;
  status: ColumnStatus;
  header: string;
};

export type StatusColor =
  | "error"
  | "secondary"
  | "quaternary"
  | "success"
  | "gray";

export type ColumnStatus = { icon: IconType | null; color: StatusColor | null };
