import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakeUserSkills, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillCategory } from "~/api/generated";

import { SkillShowcase } from "./SkillShowcasePage";

const mockSkills = fakeSkills(23);
const mockUserSkills = fakeUserSkills(23);

export default {
  component: SkillShowcase,
  title: "Pages/Skill Showcase Page",
} as Meta;

const Template: StoryFn<typeof SkillShowcase> = (args) => {
  return <SkillShowcase {...args} />;
};

export const WithData = Template.bind({});
WithData.args = {
  topBehaviouralSkills: mockUserSkills.slice(0, 5).map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index],
      category: SkillCategory.Behavioural,
    },
  })),
  topTechnicalSkills: mockUserSkills.slice(5, 15).map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index + 5],
      category: SkillCategory.Technical,
    },
  })),
  improveBehaviouralSkills: mockUserSkills
    .slice(15, 18)
    .map((userSkill, index) => ({
      ...userSkill,
      skill: {
        ...mockSkills[index + 15],
        category: SkillCategory.Behavioural,
      },
    })),
  improveTechnicalSkills: mockUserSkills.slice(18).map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index + 18],
      category: SkillCategory.Technical,
    },
  })),
};

export const NoData = Template.bind({});
NoData.args = {
  topBehaviouralSkills: [],
  topTechnicalSkills: [],
  improveBehaviouralSkills: [],
  improveTechnicalSkills: [],
};
