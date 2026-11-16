import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  experienceGenerators,
  fakeLocalizedEnum,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";
import {
  DegreeType,
  EducationStatus,
  EducationType,
  FellowshipType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";

import { ExperienceFormSkill_Fragment } from "./ExperienceFormPage";
import EducationExperienceForm, {
  EducationExperienceForm_Fragment,
} from "./EducationExperienceForm";

const skillFragments = getStaticSkills().map((skill) =>
  makeFragmentData(skill, ExperienceFormSkill_Fragment),
);
const experience = experienceGenerators.educationExperiences()[0];

const meta = {
  component: EducationExperienceForm,
  decorators: [MockGraphqlDecorator],
  args: {
    skillsQuery: skillFragments,
    userId: "user-id",
    organizationSuggestions: [],
  },
  parameters: {
    apiResponses: {
      EducationOptions: {
        data: {
          educationTypes: fakeLocalizedEnum(
            EducationType,
            "LocalizedEducationType",
          ),
          degreeTypes: fakeLocalizedEnum(DegreeType, "LocalizedDegreeType"),
          fellowshipTypes: fakeLocalizedEnum(
            FellowshipType,
            "LocalizedFellowshipType",
          ),
          educationStatuses: fakeLocalizedEnum(
            EducationStatus,
            "LocalizedEducationStatus",
          ),
        },
      },
    },
  },
} satisfies Meta<typeof EducationExperienceForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    edit: true,
    experienceId: experience.id,
    experienceQuery: makeFragmentData(
      experience,
      EducationExperienceForm_Fragment,
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
      EducationExperienceForm_Fragment,
    ),
  },
};
