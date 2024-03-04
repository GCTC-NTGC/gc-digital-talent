import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { UpdateSkillForm } from "./UpdateSkillPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: UpdateSkillForm,
  title: "Forms/Update Skill Form",
} as ComponentMeta<typeof UpdateSkillForm>;

const Template: ComponentStory<typeof UpdateSkillForm> = (args) => {
  const { initialSkill, families } = args;

  return (
    <UpdateSkillForm
      families={families}
      initialSkill={initialSkill}
      handleUpdateSkill={async (id, data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Update Skill")({
              id,
              data,
            });
            resolve(data);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  initialSkill: mockSkills[0],
  families: mockSkillFamilies,
};
