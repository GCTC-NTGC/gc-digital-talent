import React from "react";
import type { Meta, Story } from "@storybook/react";

import { getStaticSkills } from "@gc-digital-talent/fake-data";

import type { Skill } from "~/api/generated";
import type { ExperienceType } from "~/types/experience";

import { ExperienceForm } from "./ExperienceFormPage";

const skillData = getStaticSkills();

export default {
  component: ExperienceForm,
  title: "Forms/Experience Form",
  args: {
    experienceType: "award",
    skills: skillData,
    userId: "user-id",
  },
} as Meta;

interface ExperienceFormStoryArgs {
  experienceType: ExperienceType;
  skills: Skill[];
  userId: string;
}

const TemplateExperienceFormForm: Story<ExperienceFormStoryArgs> = ({
  experienceType,
  skills,
  userId,
}) => (
  <ExperienceForm
    userId={userId}
    experienceType={experienceType}
    skills={skills}
  />
);

export const IndividualExperienceForm = TemplateExperienceFormForm.bind({});
