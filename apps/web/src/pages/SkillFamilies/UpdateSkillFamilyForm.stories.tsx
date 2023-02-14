import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { UpdateSkillFamilyForm } from "./UpdateSkillFamilyPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: UpdateSkillFamilyForm,
  title: "Forms/Update Skill Family Form",
} as ComponentMeta<typeof UpdateSkillFamilyForm>;

const Template: ComponentStory<typeof UpdateSkillFamilyForm> = (args) => {
  const { initialSkillFamily, skills } = args;

  return (
    <UpdateSkillFamilyForm
      skills={skills}
      initialSkillFamily={initialSkillFamily}
      handleUpdateSkillFamily={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update SkillFamily")({
              id,
              data,
            });
            resolve(mockSkillFamilies[0]);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
  initialSkillFamily: mockSkillFamilies[0],
};
