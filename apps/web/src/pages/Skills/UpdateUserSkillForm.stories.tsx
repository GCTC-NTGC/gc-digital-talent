import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import {
  fakeExperiences,
  fakeSkills,
  fakeUsers,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { UpdateUserSkillForm } from "./UpdateUserSkillPage";

const mockUser = fakeUsers(1)[0];
const mockSkill = fakeSkills(1)[0];
const mockExperiences = fakeExperiences(3);

export default {
  component: UpdateUserSkillForm,
  title: "Forms/Update User Skill Form",
  decorators: [MockGraphqlDecorator],
  args: {
    userId: mockUser.id,
    skill: mockSkill,
    experiences: mockExperiences,
  },
} as Meta;

const Template: StoryFn<typeof UpdateUserSkillForm> = (args) => {
  return <UpdateUserSkillForm {...args} />;
};

export const TechnicalSkill = Template.bind({});
TechnicalSkill.args = {
  skill: {
    ...mockSkill,
    category: SkillCategory.Technical,
  },
};

export const BehaviouralSkill = Template.bind({});
BehaviouralSkill.args = {
  skill: {
    ...mockSkill,
    category: SkillCategory.Behavioural,
  },
};

export const NoExperiences = Template.bind({});
NoExperiences.args = {
  experiences: [],
};
