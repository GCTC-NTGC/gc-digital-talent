import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillCategory } from "~/api/generated";
import { filterSkillsByCategory } from "~/utils/skillUtils";

import MissingSkills from "./MissingSkills";

type MissingSkillsComponent = typeof MissingSkills;

const fakedSkillFamilies = fakeSkillFamilies();
const fakeBehaviouralFamily = fakedSkillFamilies[0];
fakeBehaviouralFamily.category = SkillCategory.Behavioural;
const fakeTechnicalFamily = fakedSkillFamilies[1];
fakeTechnicalFamily.category = SkillCategory.Technical;

// the two below skills arrays will be identical except with different skill.families values, therefore select skills carefully
const fakedBehaviouralSkills = fakeSkills(10, [fakeBehaviouralFamily]);
const fakedTechnicalSkills = fakeSkills(10, [fakeTechnicalFamily]);

// skills selected so as to ensure they are completely different and 2 of each category per skill grouping
const fakeRequiredSkills = [
  ...fakedBehaviouralSkills.splice(0, 2),
  ...fakedTechnicalSkills.splice(2, 2),
];
const fakeOptionalSkills = [
  ...fakedBehaviouralSkills.splice(4, 2),
  ...fakedTechnicalSkills.splice(6, 2),
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

export const MissingRequiredTechnicalSkillsWithoutDetails = Template.bind({});
MissingRequiredTechnicalSkillsWithoutDetails.args = {
  requiredSkills: fakeRequiredSkills,
  optionalSkills: [],
  addedSkills: filterSkillsByCategory(
    fakeRequiredSkills,
    SkillCategory.Technical,
  )?.map((skill) => ({
    ...skill,
    experienceSkillRecord: { details: "" },
  })),
};
