import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import {
  fakeExperiences,
  fakeSkills,
  fakeUsers,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import { makeFragmentData, SkillCategory } from "@gc-digital-talent/graphql";

import {
  UpdateUserSkill_Fragment,
  UpdateUserSkillExperience_Fragment,
  UpdateUserSkillForm,
  UpdateUserSkillSkill_Fragment,
} from "./UpdateUserSkillPage";

const mockUser = fakeUsers(1)[0];
const mockSkill = fakeSkills(1)[0];
const mockExperiences = fakeExperiences(3);
const mockUserSkill = fakeUserSkills(1, mockSkill, mockUser)[0];

const mockSkillFragment = makeFragmentData(
  mockSkill,
  UpdateUserSkillSkill_Fragment,
);
const mockExperiencesFragment = mockExperiences.map((experience) =>
  makeFragmentData(experience, UpdateUserSkillExperience_Fragment),
);

export default {
  component: UpdateUserSkillForm,
  title: "Forms/Update User Skill Form",
  decorators: [MockGraphqlDecorator],
  args: {
    userId: mockUser.id,
    skillQuery: mockSkillFragment,
    experiencesQuery: mockExperiencesFragment,
  },
} as Meta;

const Template: StoryFn<typeof UpdateUserSkillForm> = (args) => {
  return <UpdateUserSkillForm {...args} />;
};

export const TechnicalSkill = Template.bind({});
TechnicalSkill.args = {
  skillQuery: makeFragmentData(
    {
      ...mockSkill,
      category: SkillCategory.Technical,
    },
    UpdateUserSkillSkill_Fragment,
  ),
};

export const BehaviouralSkill = Template.bind({});
BehaviouralSkill.args = {
  skillQuery: makeFragmentData(
    {
      ...mockSkill,
      category: SkillCategory.Behavioural,
    },
    UpdateUserSkillSkill_Fragment,
  ),
};

export const WithValues = Template.bind({});
WithValues.args = {
  userSkillQuery: makeFragmentData(
    {
      ...mockUserSkill,
      experiences: mockExperiences.slice(0, 2),
    },
    UpdateUserSkill_Fragment,
  ),
};
