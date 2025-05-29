import { StoryFn, Meta } from "@storybook/react";

import { fakeUserSkills, fakeSkills } from "@gc-digital-talent/fake-data";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { SkillShowcase, UserSkillShowcaseFragment } from "./SkillShowcasePage";

const mockSkills = fakeSkills(23);
const mockUserSkills = fakeUserSkills(23);

export default {
  component: SkillShowcase,
} as Meta;

const Template: StoryFn<typeof SkillShowcase> = (args) => {
  return <SkillShowcase {...args} />;
};

export const WithData = {
  render: Template,

  args: {
    topBehaviouralSkillsQuery: mockUserSkills
      .slice(0, 5)
      .map((userSkill, index) => ({
        ...userSkill,
        skill: {
          ...mockSkills[index],
          category: SkillCategory.Behavioural,
        },
      })) as UserSkillShowcaseFragment,
    topTechnicalSkillsQuery: mockUserSkills
      .slice(5, 15)
      .map((userSkill, index) => ({
        ...userSkill,
        skill: {
          ...mockSkills[index + 5],
          category: SkillCategory.Technical,
        },
      })) as UserSkillShowcaseFragment,
    improveBehaviouralSkillsQuery: mockUserSkills
      .slice(15, 18)
      .map((userSkill, index) => ({
        ...userSkill,
        skill: {
          ...mockSkills[index + 15],
          category: SkillCategory.Behavioural,
        },
      })) as UserSkillShowcaseFragment,
    improveTechnicalSkillsQuery: mockUserSkills
      .slice(18)
      .map((userSkill, index) => ({
        ...userSkill,
        skill: {
          ...mockSkills[index + 18],
          category: SkillCategory.Technical,
        },
      })) as UserSkillShowcaseFragment,
  },
};

export const NoData = {
  render: Template,

  args: {
    topBehaviouralSkillsQuery: [],
    topTechnicalSkillsQuery: [],
    improveBehaviouralSkillsQuery: [],
    improveTechnicalSkillsQuery: [],
  },
};
