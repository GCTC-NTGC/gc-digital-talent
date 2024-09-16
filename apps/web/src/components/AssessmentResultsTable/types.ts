import { ColumnDef } from "@tanstack/react-table";
import { IntlShape } from "react-intl";
import { JSX } from "react";

import {
  Maybe,
  PoolSkill,
  Skill,
  AssessmentResultsTableFragment as AssessmentResultsTableFragmentType,
  Experience,
} from "@gc-digital-talent/graphql";
import { IconType } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

type PoolSkillForTableRow = Pick<PoolSkill, "id" | "requiredLevel" | "type"> & {
  skill?: Maybe<Pick<Skill, "id" | "name" | "category" | "key">>;
};

export interface AssessmentTableRow {
  poolSkill?: PoolSkillForTableRow;
  assessmentResults: AssessmentResultsTableFragmentType["assessmentResults"];
}

export type AssessmentTableRowColumn = ColumnDef<AssessmentTableRow>;

const assessmentResultsTableFragmentSteps: AssessmentResultsTableFragmentType["pool"]["assessmentSteps"] =
  [];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assessmentResultsTableFragmentStepsUnpacked = unpackMaybes(
  assessmentResultsTableFragmentSteps,
);
export type AssessmentResultsTableFragmentStepType =
  (typeof assessmentResultsTableFragmentStepsUnpacked)[number];

export interface AssessmentTableRowColumnProps {
  id: string;
  poolCandidate: AssessmentResultsTableFragmentType;
  experiences: Omit<Experience, "user">[];
  assessmentStep: AssessmentResultsTableFragmentStepType;
  intl: IntlShape;
  header: JSX.Element;
}

export type StatusColor = "error" | "hold" | "toAssess" | "success" | "gray";

export interface ColumnStatus {
  icon: IconType | null;
  color: StatusColor;
}
