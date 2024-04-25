import React from "react";
import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  experienceGenerators,
  getStaticSkills,
} from "@gc-digital-talent/fake-data";

import ExperienceCard from "./ExperienceCard";

faker.seed(0);

export default {
  component: ExperienceCard,
};

const Template: StoryFn<typeof ExperienceCard> = (args) => {
  return <ExperienceCard {...args} />;
};

export const AwardExperienceCard = Template.bind({});
AwardExperienceCard.args = {
  experience: experienceGenerators.awardExperiences()[0],
};

export const CommunityExperienceCard = Template.bind({});
CommunityExperienceCard.args = {
  experience: experienceGenerators.communityExperiences()[0],
};

export const EducationExperienceCard = Template.bind({});
EducationExperienceCard.args = {
  experience: experienceGenerators.educationExperiences()[0],
};

export const PersonalExperienceCard = Template.bind({});
PersonalExperienceCard.args = {
  experience: experienceGenerators.personalExperiences()[0],
};

export const WorkExperienceCard = Template.bind({});
WorkExperienceCard.args = {
  experience: experienceGenerators.workExperiences()[0],
};

export const NoSkillsExperienceCard = Template.bind({});
NoSkillsExperienceCard.args = {
  experience: {
    ...experienceGenerators.workExperiences()[0],
    skills: [],
  },
};

const experienceSkill = faker.helpers.arrayElement(getStaticSkills());
export const SingleSkillExperienceCard = Template.bind({});
SingleSkillExperienceCard.args = {
  experience: {
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
  showSkills: experienceSkill,
};
