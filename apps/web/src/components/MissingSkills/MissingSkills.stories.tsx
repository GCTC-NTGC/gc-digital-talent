import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { filterSkillsByCategory } from "~/utils/skillUtils";

import MissingSkills from "./MissingSkills";

type MissingSkillsComponent = typeof MissingSkills;

const fakedSkillFamilies = fakeSkillFamilies(2);

// four skills for each category and all different
const fakedBehaviouralSkills = fakeSkills(
  4,
  [fakedSkillFamilies[0]],
  SkillCategory.Behavioural,
);
const fakedTechnicalSkills = fakeSkills(
  8,
  [fakedSkillFamilies[1]],
  SkillCategory.Technical,
).slice(4);

// 2 technical and two behavioural skills for a total of 4 for both required and optional
// behavioural preceding in the arrays
const fakeRequiredSkills = [
  ...fakedBehaviouralSkills.slice(0, 2),
  ...fakedTechnicalSkills.slice(0, 2),
];
const fakeOptionalSkills = [
  ...fakedBehaviouralSkills.slice(2),
  ...fakedTechnicalSkills.slice(2),
];

export default {
  title: "Components/Missing Skills",
  component: MissingSkills,
} as Meta<MissingSkillsComponent>;

const Template: StoryFn<MissingSkillsComponent> = (args) => {
  return <MissingSkills {...args} />;
};

export const MissingOptionalSkills = Template.bind({});
MissingOptionalSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: fakeRequiredSkills,
};

export const MissingOptionalAndRequiredSkills = Template.bind({});
MissingOptionalAndRequiredSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: [],
};

export const MissingRequiredBehaviouralSkills = Template.bind({});
MissingRequiredBehaviouralSkills.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: filterSkillsByCategory(
    fakeRequiredSkills,
    SkillCategory.Technical,
  ),
};

export const MissingRequiredTechnicalSkillsWithDetails = Template.bind({});
MissingRequiredTechnicalSkillsWithDetails.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: [],
  addedSkills: filterSkillsByCategory(
    fakeRequiredSkills,
    SkillCategory.Behavioural,
  ),
};

export const MissingSkillsAndPartialDetails = Template.bind({});
MissingSkillsAndPartialDetails.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: fakeOptionalSkills,
  addedSkills: [
    {
      ...fakeRequiredSkills[0],
      experienceSkillRecord: { details: null },
    },
    {
      ...fakeRequiredSkills[1],
      experienceSkillRecord: { details: "details" },
    },
    {
      ...fakeRequiredSkills[2],
      experienceSkillRecord: { details: null },
    },
    {
      ...fakeOptionalSkills[0],
      experienceSkillRecord: { details: null },
    },
    {
      ...fakeOptionalSkills[1],
      experienceSkillRecord: { details: "details" },
    },
    {
      ...fakeOptionalSkills[2],
      experienceSkillRecord: { details: null },
    },
  ],
};
