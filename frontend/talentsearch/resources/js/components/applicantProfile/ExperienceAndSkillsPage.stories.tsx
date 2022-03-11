import React from "react";
import { Story, Meta } from "@storybook/react";
import ExperienceAndSkillsPage from "./ExperienceAndSkillsPage";

export default {
  component: ExperienceAndSkillsPage,
  title: "ApplicantProfile/ExperienceAndSkillsPage",
} as Meta;

const TemplateExperienceAndSkillsPage: Story = () => {
  return <ExperienceAndSkillsPage experiences={[]} />;
};

export const Default = TemplateExperienceAndSkillsPage.bind({});
