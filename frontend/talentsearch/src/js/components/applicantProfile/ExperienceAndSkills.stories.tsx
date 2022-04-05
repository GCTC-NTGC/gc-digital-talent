import React from "react";
import { Story, Meta } from "@storybook/react";
import fakeExperiences from "@common/fakeData/fakeExperiences";
import generate from "@common/fakeData/fakeExperienceSkills";
import { fakeSkills } from "@common/fakeData";
import ExperienceAndSkills, {
  ExperienceAndSkillsProps,
} from "./ExperienceAndSkills";

const skills = fakeSkills(5);
const experiences = fakeExperiences(10).map((experience) => {
  return {
    ...experience,
    experienceSkills: [
      generate.generateExperienceSkill(skills[0], experience),
      generate.generateExperienceSkill(skills[1], experience),
      generate.generateExperienceSkill(skills[2], experience),
    ],
  };
});

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
export const WithExperienceSkills = TemplateExperienceAndSkillsPage.bind({});

NoExperiences.args = {
  experiences: [],
};

WithExperiences.args = {
  experiences: fakeExperiences(10),
};

WithExperienceSkills.args = {
  experiences,
};
