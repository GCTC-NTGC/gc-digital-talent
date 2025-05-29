import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ExperienceCard, { ExperienceCard_Fragment } from "./ExperienceCard";

faker.seed(0);

export default {
  component: ExperienceCard,
};

const Template: StoryFn<typeof ExperienceCard> = (args) => {
  return <ExperienceCard {...args} />;
};

export const AwardExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      experienceGenerators.awardExperiences()[0],
      ExperienceCard_Fragment,
    ),
  },
};

export const CommunityExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      experienceGenerators.communityExperiences()[0],
      ExperienceCard_Fragment,
    ),
  },
};

export const EducationExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      experienceGenerators.educationExperiences()[0],
      ExperienceCard_Fragment,
    ),
  },
};

export const PersonalExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      experienceGenerators.personalExperiences()[0],
      ExperienceCard_Fragment,
    ),
  },
};

export const WorkExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      experienceGenerators.workExperiences()[0],
      ExperienceCard_Fragment,
    ),
  },
};

export const NoSkillsExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      {
        ...experienceGenerators.workExperiences()[0],
        skills: [],
      },
      ExperienceCard_Fragment,
    ),
  },
};

const experienceSkill = faker.helpers.arrayElement(getStaticSkills());

export const SingleSkillExperienceCard = {
  render: Template,

  args: {
    experienceQuery: makeFragmentData(
      {
        ...experienceGenerators.workExperiences()[0],
        skills: [
          {
            ...experienceSkill,
            experienceSkillRecord: {
              details: faker.lorem.paragraph(),
            },
          },
        ],
      },
      ExperienceCard_Fragment,
    ),
    showSkills: experienceSkill,
  },
};
