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
  header: JSX.Element;
};

export type StatusColor = "error" | "hold" | "toAssess" | "success" | "gray";

export type ColumnStatus = {
  icon: IconType | null;
  color: StatusColor;
};
