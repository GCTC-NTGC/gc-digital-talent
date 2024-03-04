import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { CreateSkillFamilyForm } from "./CreateSkillFamilyPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: CreateSkillFamilyForm,
  title: "Forms/Create Skill Family Form",
} as ComponentMeta<typeof CreateSkillFamilyForm>;

const Template: ComponentStory<typeof CreateSkillFamilyForm> = (args) => {
  const { skills } = args;
  return (
    <CreateSkillFamilyForm
      skills={skills}
      handleCreateSkillFamily={async (data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Create Skill Family")(data);
            return resolve(mockSkillFamilies[0]);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
};
