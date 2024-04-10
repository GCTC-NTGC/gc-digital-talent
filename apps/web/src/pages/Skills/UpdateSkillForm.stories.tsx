import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkills, fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { UpdateSkillForm } from "./UpdateSkillPage";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: UpdateSkillForm,
  title: "Forms/Update Skill Form",
} as Meta<typeof UpdateSkillForm>;

const Template: StoryFn<typeof UpdateSkillForm> = (args) => {
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
