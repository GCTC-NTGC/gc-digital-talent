import type { Meta, StoryFn } from "@storybook/react-vite";

import { fakeSkillFamilies } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  SkillFamilyTable,
  SkillFamilyTableRow_Fragment,
} from "./SkillFamilyTable";

const mockSkillFamilies = fakeSkillFamilies().map((skillFamily) =>
  makeFragmentData(skillFamily, SkillFamilyTableRow_Fragment),
);

export default {
  component: SkillFamilyTable,
} as Meta<typeof SkillFamilyTable>;

const Template: StoryFn<typeof SkillFamilyTable> = (args) => {
  const { query, title } = args;
  return <SkillFamilyTable query={query} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  query: mockSkillFamilies,
  title: "Skill families",
};
