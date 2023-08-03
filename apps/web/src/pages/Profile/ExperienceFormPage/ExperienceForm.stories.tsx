import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { getStaticSkills } from "@gc-digital-talent/fake-data";
import type { Skill } from "~/api/generated";
import type {
  ExperienceDetailsSubmissionData,
  ExperienceType,
} from "~/types/experience";
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
    onUpdateExperience={async (data: ExperienceDetailsSubmissionData) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      });
      action("Update Experience")(data);
    }}
    deleteExperience={() => {
      /* do nothing */
    }}
  />
);

export const IndividualExperienceForm = TemplateExperienceFormForm.bind({});
