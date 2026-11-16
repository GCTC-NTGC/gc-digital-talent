import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  experienceGenerators,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { ExperienceFormSkill_Fragment } from "./ExperienceFormPage";
import CommunityExperienceForm, {
  CommunityExperienceForm_Fragment,
} from "./CommunityExperienceForm";

const skillFragments = getStaticSkills().map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);
const experience = experienceGenerators.communityExperiences()[0];

const meta = {
  component: CommunityExperienceForm,
  args: {
    skillsQuery: skillFragments,
    userId: "user-id",
    organizationSuggestions: [],
  },
} satisfies Meta<typeof CommunityExperienceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    edit: true,
    experienceId: experience.id,
    experienceQuery: makeFragmentData(
      experience,
      CommunityExperienceForm_Fragment,
    ),
  },
};

export const EditWithRelatedAward: Story = {
  args: {
    ...Edit.args,
    experienceQuery: makeFragmentData(
      {
        ...experience,
        awardExperiences: experienceGenerators.awardExperiences(),
      },
      CommunityExperienceForm_Fragment,
    ),
  },
};
