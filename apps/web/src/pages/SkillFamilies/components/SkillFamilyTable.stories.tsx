import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { SkillFamilyTable } from "./SkillFamilyTable";

const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillFamilyTable,
  title: "Tables/Skill Family Table",
} as ComponentMeta<typeof SkillFamilyTable>;

const Template: ComponentStory<typeof SkillFamilyTable> = (args) => {
  const { skillFamilies } = args;
  return <SkillFamilyTable skillFamilies={skillFamilies} />;
};

export const Default = Template.bind({});
Default.args = {
  skillFamilies: mockSkillFamilies,
};
