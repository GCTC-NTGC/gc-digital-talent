import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkillFamily } from "@common/fakeData";
import Checklist, { ChecklistProps } from "../components/skills/Checklist";

export default {
  component: Checklist,
  title: "Checklist",
  args: {
    skillFamilies: fakeSkillFamily(),
    handleCheckedCallback: action("handleChecked"),
  },
} as Meta;

const TemplateChecklist: Story<ChecklistProps> = (args) => {
  return <Checklist {...args} />;
};

export const ChecklistStory = TemplateChecklist.bind({});
