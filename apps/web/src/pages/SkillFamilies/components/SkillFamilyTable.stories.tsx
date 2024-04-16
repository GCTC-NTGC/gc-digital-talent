import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { SkillFamilyTable } from "./SkillFamilyTable";

const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillFamilyTable,
  title: "Tables/Skill Family Table",
} as Meta<typeof SkillFamilyTable>;

const Template: StoryFn<typeof SkillFamilyTable> = (args) => {
  const { skillFamilies, title } = args;
  return <SkillFamilyTable skillFamilies={skillFamilies} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  skillFamilies: mockSkillFamilies,
  title: "Skill families",
};
