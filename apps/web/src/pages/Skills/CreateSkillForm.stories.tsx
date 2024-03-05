import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { CreateSkillForm } from "./CreateSkillPage";

const mockFamilies = fakeSkillFamilies();

export default {
  component: CreateSkillForm,
  title: "Forms/Create Skill Form",
} as ComponentMeta<typeof CreateSkillForm>;

const Template: ComponentStory<typeof CreateSkillForm> = (args) => {
  const { families } = args;
  return (
    <CreateSkillForm
      families={families}
      handleCreateSkill={async (data) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            action("Create skill")(data);
            return resolve(data);
          }, 1000);
        });
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  families: mockFamilies,
};
