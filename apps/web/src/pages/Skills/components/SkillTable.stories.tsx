import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillTable } from "./SkillTable";

const mockSkills = fakeSkills();

export default {
  component: SkillTable,
  title: "Tables/Skill Table",
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof SkillTable>;

const Template: ComponentStory<typeof SkillTable> = (args) => {
  const { skills } = args;
  return <SkillTable skills={skills} />;
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
};
