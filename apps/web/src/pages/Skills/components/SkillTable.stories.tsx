import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillTable } from "./SkillTable";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillTable,
} as Meta<typeof SkillTable>;

const Template: StoryFn<typeof SkillTable> = (args) => {
  const { skills, skillFamilies, title } = args;
  return (
    <SkillTable skills={skills} title={title} skillFamilies={skillFamilies} />
  );
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
  skillFamilies: mockSkillFamilies,
  title: "Skills",
};
