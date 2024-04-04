import React from "react";
import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import { BasicForm } from "@gc-digital-talent/forms";

import type { FormSkills } from "~/types/experience";

import SkillsInDetail from "./SkillsInDetail";

export default {
  component: SkillsInDetail,
  title: "Components/Skills In Detail",
  args: {
    skills: [],
    onDelete: (skillId: string) =>
      action("Remove skill from experience")(skillId),
  },
};

const Template: StoryFn<typeof SkillsInDetail> = (args) => {
  return (
    <BasicForm onSubmit={action("submit")}>
      <SkillsInDetail {...args} />
    </BasicForm>
  );
};

export const Default = Template.bind({});
Default.args = {
  skills: fakeSkills(2).map((skill) => ({
    id: skill.id,
    skillId: skill.id,
    name: skill.name,
  })) as FormSkills,
};
