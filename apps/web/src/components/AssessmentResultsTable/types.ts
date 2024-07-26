import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  AssessmentStep,
  Maybe,
  PoolCandidate,
  PoolSkill,
  Skill,
  AssessmentResultsTableFragment as AssessmentResultsTableFragmentType,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";

type PoolSkillForTableRow = Pick<PoolSkill, "id" | "requiredLevel" | "type"> & {
  skill?: Maybe<Pick<Skill, "id" | "name" | "category" | "key">>;
};

export type AssessmentTableRow = {
  poolSkill?: PoolSkillForTableRow;
  assessmentResults: AssessmentResultsTableFragmentType["assessmentResults"];
};

export type AssessmentTableRowColumn = ColumnDef<AssessmentTableRow>;

export type AssessmentStepForTableRow = Pick<
  AssessmentStep,
  "id" | "type" | "title"
> & { poolSkills?: Maybe<Maybe<Pick<PoolSkill, "id">>[]> };

export type AssessmentTableRowColumnProps = {
  id: string;
  poolCandidate: PoolCandidate;
  assessmentStep: AssessmentStepForTableRow;
  intl: IntlShape;
  header: JSX.Element;
};

export type StatusColor = "error" | "hold" | "toAssess" | "success" | "gray";

export type ColumnStatus = {
  icon: IconType | null;
  color: StatusColor;
};
