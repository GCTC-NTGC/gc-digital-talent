import React from "react";
import { StoryFn } from "@storybook/react";

import { experienceGenerators } from "@gc-digital-talent/fake-data";

import ExperienceCard from "./ExperienceCard";

export default {
  component: ExperienceCard,
  title: "Components/Experience Card",
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
