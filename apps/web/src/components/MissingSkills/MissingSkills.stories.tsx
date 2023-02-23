import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillCategory } from "~/api/generated";
import { filterSkillsByCategory } from "~/utils/skillUtils";

import MissingSkills from "./MissingSkills";

type MissingSkillsComponent = typeof MissingSkills;

const skills = fakeSkills(10, fakeSkillFamilies(2));

const fakeRequiredSkills = skills.splice(0, skills.length / 2);
const fakeOptionalSkills = skills.splice(skills.length / 2, skills.length);

export default {
  title: "Components/Missing Skills",
  component: MissingSkills,
} as ComponentMeta<MissingSkillsComponent>;

const Template: ComponentStory<MissingSkillsComponent> = (args) => {
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
