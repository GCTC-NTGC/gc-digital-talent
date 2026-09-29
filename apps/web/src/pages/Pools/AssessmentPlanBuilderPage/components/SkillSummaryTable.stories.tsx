import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  AssessmentStepType,
  PoolSkillType,
  SkillCategory,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import SkillSummaryTable, {
  SkillSummaryTableAssessmentStep_Fragment,
  SkillSummaryTablePoolSkill_Fragment,
} from "./SkillSummaryTable";

faker.seed(0);

export default {
  component: SkillSummaryTable,
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
const poolSkillsArray = [
  {
    id: "poolSkill1",
    skill: technicalSkill1,
    type: toLocalizedEnum(PoolSkillType.Essential, "LocalizedPoolSkillType"),
    assessmentSteps: [
      {
        id: "assessmentStep1",
        type: toLocalizedEnum(
          AssessmentStepType.ApplicationScreening,
          "LocalizedAssessmentStepType",
        ),
      },
    ],
  },
  {
    id: "poolSkill2",
    skill: technicalSkill2,
    type: toLocalizedEnum(PoolSkillType.Essential, "LocalizedPoolSkillType"),
    assessmentSteps: [
      {
        id: "assessmentStep1",
        type: toLocalizedEnum(
          AssessmentStepType.ApplicationScreening,
          "LocalizedAssessmentStepType",
        ),
      },
    ],
  },
  {
    id: "poolSkill3",
    skill: behaviouralSkill3,
    type: toLocalizedEnum(PoolSkillType.Nonessential, "LocalizedPoolSkillType"),
    assessmentSteps: [
      {
        id: "assessmentStep2",
        type: toLocalizedEnum(
          AssessmentStepType.ReferenceCheck,
          "LocalizedAssessmentStepType",
        ),
      },
    ],
  },
  {
    id: "orphanPoolSkill",
    skill: behaviouralSkill4,
    type: toLocalizedEnum(PoolSkillType.Nonessential, "LocalizedPoolSkillType"),
    assessmentSteps: [],
  },
];

const assessmentStepsArray = [
  {
    id: "assessmentStep1",
    pool: fakePool,
    poolSkills: [
      {
        id: "poolSkill1",
        type: toLocalizedEnum(
          PoolSkillType.Essential,
          "LocalizedPoolSkillType",
        ),
      },
      {
        id: "poolSkill2",
        type: toLocalizedEnum(
          PoolSkillType.Essential,
          "LocalizedPoolSkillType",
        ),
      },
    ],
    sortOrder: 1,
    title: {
      en: "Application Screening EN",
      fr: "Application Screening FR",
      localized: "Application Screening LOCALIZED",
    },
    type: toLocalizedEnum(
      AssessmentStepType.ApplicationScreening,
      "LocalizedAssessmentStepType",
    ),
  },
  {
    id: "assessmentStep2",
    pool: fakePool,
    poolSkills: [
      {
        id: "poolSkill3",
        type: toLocalizedEnum(
          PoolSkillType.Nonessential,
          "LocalizedPoolSkillType",
        ),
      },
    ],
    sortOrder: 2,
    title: {
      en: "Reference EN",
      fr: "Reference FR",
      localized: "Reference LOCALIZED",
    },
    type: toLocalizedEnum(
      AssessmentStepType.ReferenceCheck,
      "LocalizedAssessmentStepType",
    ),
  },
];

export const Default = Template.bind({});
Default.args = {
  title: faker.lorem.words(1),
  poolSkillsQuery: poolSkillsArray.map((poolSkill) =>
    makeFragmentData(poolSkill, SkillSummaryTablePoolSkill_Fragment),
  ),
  assessmentStepsQuery: assessmentStepsArray.map((assessmentStep) =>
    makeFragmentData(assessmentStep, SkillSummaryTableAssessmentStep_Fragment),
  ),
};
