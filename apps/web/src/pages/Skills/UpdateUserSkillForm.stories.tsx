import { StoryFn, Meta } from "@storybook/react-vite";

import {
  fakeExperiences,
  fakeSkills,
  fakeUsers,
  fakeUserSkills,
  toLocalizedEnum,
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

export const TechnicalSkill = {
  render: Template,

  args: {
    skillQuery: makeFragmentData(
      {
        ...mockSkill,
        category: toLocalizedEnum(SkillCategory.Technical),
      },
      UpdateUserSkillSkill_Fragment,
    ),
  },
};

export const BehaviouralSkill = {
  render: Template,

  args: {
    skillQuery: makeFragmentData(
      {
        ...mockSkill,
        category: toLocalizedEnum(SkillCategory.Behavioural),
      },
      UpdateUserSkillSkill_Fragment,
    ),
  },
};

export const WithValues = {
  render: Template,

  args: {
    userSkillQuery: makeFragmentData(
      {
        ...mockUserSkill,
        experiences: mockExperiences.slice(0, 2),
      },
      UpdateUserSkill_Fragment,
    ),
  },
};
