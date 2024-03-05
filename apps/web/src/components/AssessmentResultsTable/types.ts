import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";

import {
  AssessmentResult,
  AssessmentStep,
  PoolCandidate,
  PoolSkill,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

export type AssessmentTableRow = {
  poolSkill?: PoolSkill;
  assessmentResults: AssessmentResult[];
};

export type AssessmentTableRowColumn = ColumnDef<AssessmentTableRow>;

export type AssessmentTableRowColumnProps = {
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
