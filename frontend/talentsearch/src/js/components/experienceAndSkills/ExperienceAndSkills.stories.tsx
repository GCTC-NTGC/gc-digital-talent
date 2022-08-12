import React from "react";
import { Story, Meta } from "@storybook/react";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import {
  ExperienceAndSkills,
  ExperienceAndSkillsProps,
} from "./ExperienceAndSkills";

export default {
  component: ExperienceAndSkills,
  title: "ApplicantProfile/ExperienceAndSkillsPage",
} as Meta;

const TemplateExperienceAndSkillsPage: Story<ExperienceAndSkillsProps> = (
  args,
) => {
  return <ExperienceAndSkills {...args} />;
};

export const NoExperiences = TemplateExperienceAndSkillsPage.bind({});
export const WithExperiences = TemplateExperienceAndSkillsPage.bind({});

NoExperiences.args = {
  experiences: [],
};

WithExperiences.args = {
  experiences: fakeExperiences(10),
};
