import { StoryFn, Meta } from "@storybook/react-vite";

import { fakeUserSkills, fakeSkills } from "@gc-digital-talent/fake-data";
import { makeFragmentData, SkillCategory } from "@gc-digital-talent/graphql";

import { SkillShowcase, SkillShowcase_Fragment } from "./SkillShowcasePage";

const mockSkills = fakeSkills(23);
const mockUserSkills = fakeUserSkills(23);

const topBehaviouralSkillsRanking = mockUserSkills
  .slice(0, 5)
  .map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index],
      category: SkillCategory.Behavioural,
    },
  }));

const topTechnicalSkillsRanking = mockUserSkills
  .slice(5, 15)
  .map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index + 5],
      category: SkillCategory.Technical,
    },
  }));

const improveBehaviouralSkillsRanking = mockUserSkills
  .slice(15, 18)
  .map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index + 15],
      category: SkillCategory.Behavioural,
    },
  }));

const improveTechnicalSkillsRanking = mockUserSkills
  .slice(18)
  .map((userSkill, index) => ({
    ...userSkill,
    skill: {
      ...mockSkills[index + 18],
      category: SkillCategory.Technical,
    },
  }));

export default {
  component: SkillShowcase,
} as Meta;

const Template: StoryFn<typeof SkillShowcase> = (args) => {
  return <SkillShowcase {...args} />;
};

export const WithData = Template.bind({});
WithData.args = {
  query: makeFragmentData(
    {
      topBehaviouralSkillsRanking,
      topTechnicalSkillsRanking,
      improveBehaviouralSkillsRanking,
      improveTechnicalSkillsRanking,
    },
    SkillShowcase_Fragment,
  ),
};

export const NoData = Template.bind({});
NoData.args = {
  query: makeFragmentData({}, SkillShowcase_Fragment),
};
