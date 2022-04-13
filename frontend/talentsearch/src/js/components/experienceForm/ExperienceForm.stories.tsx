import React from "react";
import type { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import type { Skill } from "@common/api/generated";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import { ExperienceForm } from "./ExperienceForm";
import type { ExperienceType } from "./ExperienceForm";

const skillData = fakeSkills(15, fakeSkillFamilies(4));

export default {
  component: ExperienceForm,
  title: "ExperienceForm",
  args: {
    experienceType: "award",
    skills: skillData,
  },
} as Meta;

interface ExperienceFormStoryArgs {
  experienceType: ExperienceType;
  skills: Skill[];
}

const TemplateExperienceFormForm: Story<ExperienceFormStoryArgs> = ({
  experienceType,
  skills,
}) => (
  <ExperienceForm
    experienceType={experienceType}
    skills={skills}
    onUpdateExperience={async (data: any) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 1000);
      });
      action("Update Experience")(data);
      return "null";
    }}
  />
);

export const IndividualExperienceForm = TemplateExperienceFormForm.bind({});
