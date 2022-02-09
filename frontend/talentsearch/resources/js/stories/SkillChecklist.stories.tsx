import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import SkillChecklist, {
  SkillChecklistProps,
} from "../components/skills/SkillChecklist";

export default {
  component: SkillChecklist,
  title: "Skill Checklist",
  args: {
    skills: fakeSkills(10, fakeSkillFamilies(3)),
    callback: action("handleChecked"),
  },
} as Meta;

const TemplateSkillChecklist: Story<SkillChecklistProps> = (args) => {
  return <SkillChecklist {...args} />;
};

export const SkillChecklistStory = TemplateSkillChecklist.bind({});
