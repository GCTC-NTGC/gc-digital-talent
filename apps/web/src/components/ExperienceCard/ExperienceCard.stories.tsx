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

export const AwardExperienceCard = Template.bind({});
AwardExperienceCard.args = {
  experienceQuery: makeFragmentData(
    experienceGenerators.awardExperiences()[0],
    ExperienceCard_Fragment,
  ),
};

export const CommunityExperienceCard = Template.bind({});
CommunityExperienceCard.args = {
  experienceQuery: makeFragmentData(
    experienceGenerators.communityExperiences()[0],
    ExperienceCard_Fragment,
  ),
};

export const EducationExperienceCard = Template.bind({});
EducationExperienceCard.args = {
  experienceQuery: makeFragmentData(
    experienceGenerators.educationExperiences()[0],
    ExperienceCard_Fragment,
  ),
};

export const PersonalExperienceCard = Template.bind({});
PersonalExperienceCard.args = {
  experienceQuery: makeFragmentData(
    experienceGenerators.personalExperiences()[0],
    ExperienceCard_Fragment,
  ),
};

export const WorkExperienceCard = Template.bind({});
WorkExperienceCard.args = {
  experienceQuery: makeFragmentData(
    experienceGenerators.workExperiences()[0],
    ExperienceCard_Fragment,
  ),
};

export const NoSkillsExperienceCard = Template.bind({});
NoSkillsExperienceCard.args = {
  experienceQuery: makeFragmentData(
    {
      ...experienceGenerators.workExperiences()[0],
      skills: [],
    },
    ExperienceCard_Fragment,
  ),
};

const experienceSkill = faker.helpers.arrayElement(getStaticSkills());
export const SingleSkillExperienceCard = Template.bind({});
SingleSkillExperienceCard.args = {
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
};
