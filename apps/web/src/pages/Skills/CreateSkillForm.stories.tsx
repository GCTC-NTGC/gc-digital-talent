import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { CreateSkillForm } from "./CreateSkillPage";

const mockFamilies = fakeSkillFamilies();

export default {
  component: CreateSkillForm,
  title: "Forms/Create Skill Form",
} as Meta<typeof CreateSkillForm>;

const Template: StoryFn<typeof CreateSkillForm> = (args) => {
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
