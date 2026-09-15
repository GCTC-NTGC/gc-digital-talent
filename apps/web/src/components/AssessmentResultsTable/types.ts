import type { ColumnDef } from "@tanstack/react-table";

import type {
  AssessmentDecision,
  AssessmentResultType,
  LocalizedString,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";
import type { IconType } from "@gc-digital-talent/ui";

interface AssessedSkill {
  id: string;
  name?: LocalizedString | null;
}

interface AssessedPoolSkill {
  id: string;
  type?: GenericLocalizedEnum<PoolSkillType> | null;
  skill?: AssessedSkill | null;
}

export interface AssessmentRowResult {
  id: string;
  assessmentResultType?: AssessmentResultType | null;
  assessmentDecision?: GenericLocalizedEnum<AssessmentDecision> | null;
  assessmentStep?: { id: string } | null;
  poolSkill?: { id: string } | null;
}

export interface AssessmentTableRow {
  poolSkill?: AssessedPoolSkill;
  assessmentResults: AssessmentRowResult[];
}

export type AssessmentTableRowColumn = ColumnDef<AssessmentTableRow>;

export type StatusColor = "error" | "hold" | "toAssess" | "success" | "gray";

export interface ColumnStatus {
  icon: IconType | null;
  color: StatusColor;
}
