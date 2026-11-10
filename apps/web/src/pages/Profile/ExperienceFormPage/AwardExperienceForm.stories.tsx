import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  experienceGenerators,
  fakeLocalizedEnum,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  AwardedScope,
  AwardedTo,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import { ExperienceFormSkill_Fragment } from "./ExperienceFormPage";
import AwardExperienceForm, {
  AwardExperienceForm_Fragment,
} from "./AwardExperienceForm";

const skillFragments = getStaticSkills().map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);
const experience = experienceGenerators.awardExperiences()[0];

const meta = {
  component: AwardExperienceForm,
  decorators: [MockGraphqlDecorator],
  args: {
    skillsQuery: skillFragments,
    userId: "user-id",
    organizationSuggestions: [],
  },
  parameters: {
    apiResponses: {
      AwardOptions: {
        data: {
          awardedTo: fakeLocalizedEnum(AwardedTo, "LocalizedAwardedTo"),
          awardedScopes: fakeLocalizedEnum(
            AwardedScope,
            "LocalizedAwardedScope",
          ),
          me: {
            id: "user-id",
            experiences: [
              ...experienceGenerators.workExperiences(),
              ...experienceGenerators.communityExperiences(),
            ],
          },
        },
      },
    },
  },
} satisfies Meta<typeof AwardExperienceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    edit: true,
    experienceId: experience.id,
    experienceQuery: makeFragmentData(experience, AwardExperienceForm_Fragment),
  },
};
