import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  Maybe,
  PoolSkill,
  Skill,
  AssessmentResultsTableFragment as AssessmentResultsTableFragmentType,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

type PoolSkillForTableRow = Pick<PoolSkill, "id" | "requiredLevel" | "type"> & {
  skill?: Maybe<Pick<Skill, "id" | "name" | "category" | "key">>;
};

export type AssessmentTableRow = {
  poolSkill?: PoolSkillForTableRow;
  assessmentResults: AssessmentResultsTableFragmentType["assessmentResults"];
};

export type AssessmentTableRowColumn = ColumnDef<AssessmentTableRow>;

const assessmentResultsTableFragmentSteps: AssessmentResultsTableFragmentType["pool"]["assessmentSteps"] =
  [];
const assessmentResultsTableFragmentStepsUnpacked = unpackMaybes(
  assessmentResultsTableFragmentSteps,
);
export type AssessmentResultsTableFragmentStepType =
  (typeof assessmentResultsTableFragmentStepsUnpacked)[number];

export type AssessmentTableRowColumnProps = {
  id: string;
  poolCandidate: AssessmentResultsTableFragmentType;
  assessmentStep: AssessmentResultsTableFragmentStepType;
  intl: IntlShape;
  header: JSX.Element;
};

export type StatusColor = "error" | "hold" | "toAssess" | "success" | "gray";

export type ColumnStatus = {
  icon: IconType | null;
  color: StatusColor;
};
