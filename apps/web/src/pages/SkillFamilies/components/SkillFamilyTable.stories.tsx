import { Meta, StoryFn } from "@storybook/react-vite";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";

import { SkillFamilyTable } from "./SkillFamilyTable";

const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillFamilyTable,
} as Meta<typeof SkillFamilyTable>;

const Template: StoryFn<typeof SkillFamilyTable> = (args) => {
  const { skillFamilies, title } = args;
  return <SkillFamilyTable skillFamilies={skillFamilies} title={title} />;
};

export const Default = {
  render: Template,

  args: {
    skillFamilies: mockSkillFamilies,
    title: "Skill families",
  },
};
