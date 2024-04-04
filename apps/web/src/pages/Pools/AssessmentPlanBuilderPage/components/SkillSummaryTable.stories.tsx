import React from "react";
import type { StoryFn } from "@storybook/react";

import {
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentStep,
  AssessmentStepType,
  PoolSkill,
  PoolSkillType,
  SkillCategory,
} from "@gc-digital-talent/graphql";

import SkillSummaryTable from "./SkillSummaryTable";

export default {
  component: SkillSummaryTable,
  title: "Components/SkillSummaryTable",
};

const Template: StoryFn<typeof SkillSummaryTable> = (args) => {
  return <SkillSummaryTable {...args} />;
};

const fakePool = fakePools(1)[0];
const technicalSkill1 = fakeSkills(
  1,
  fakeSkillFamilies(1),
  SkillCategory.Technical,
)[0];
const technicalSkill2 = fakeSkills(
  2,
  fakeSkillFamilies(1),
  SkillCategory.Technical,
)[1];
const behaviouralSkill3 = fakeSkills(
  3,
  fakeSkillFamilies(1),
  SkillCategory.Behavioural,
)[2];
const behaviouralSkill4 = fakeSkills(
  4,
  fakeSkillFamilies(1),
  SkillCategory.Behavioural,
)[3];
const poolSkillsArray: PoolSkill[] = [
  {
    id: "poolSkill1",
    skill: technicalSkill1,
    type: PoolSkillType.Essential,
    assessmentSteps: [
      {
        id: "assessmentStep1",
        type: AssessmentStepType.ApplicationScreening,
      },
    ],
  },
  {
    id: "poolSkill2",
    skill: technicalSkill2,
    type: PoolSkillType.Essential,
    assessmentSteps: [
      {
        id: "assessmentStep1",
        type: AssessmentStepType.ApplicationScreening,
      },
    ],
  },
  {
    id: "poolSkill3",
    skill: behaviouralSkill3,
    type: PoolSkillType.Nonessential,
    assessmentSteps: [
      {
        id: "assessmentStep2",
        type: AssessmentStepType.ReferenceCheck,
      },
    ],
  },
  {
    id: "orphanPoolSkill",
    skill: behaviouralSkill4,
    type: PoolSkillType.Nonessential,
    assessmentSteps: [],
  },
];

const assessmentStepsArray: AssessmentStep[] = [
  {
    id: "assessmentStep1",
    pool: fakePool,
    poolSkills: [
      {
        id: "poolSkill1",
        type: PoolSkillType.Essential,
      },
      {
        id: "poolSkill2",
        type: PoolSkillType.Essential,
      },
    ],
    sortOrder: 1,
    title: { en: "Application Screening EN", fr: "Application Screening FR" },
    type: AssessmentStepType.ApplicationScreening,
  },
  {
    id: "assessmentStep2",
    pool: fakePool,
    poolSkills: [
      {
        id: "poolSkill3",
        type: PoolSkillType.Nonessential,
      },
    ],
    sortOrder: 2,
    title: { en: "Reference EN", fr: "Reference FR" },
    type: AssessmentStepType.ReferenceCheck,
  },
];

export const Default = Template.bind({});
Default.args = {
  title: "Title",
  poolSkills: poolSkillsArray,
  assessmentSteps: assessmentStepsArray,
};
