import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import SkillFamilyPicker, { SkillFamilyPickerProps } from "./SkillFamilyPicker";

export default {
  component: SkillFamilyPicker,
  title: "Skill Family Picker",
  args: {
    skillFamilies: fakeSkillFamilies(3, fakeSkills(10)),
    callback: action("handleChecked"),
  },
} as Meta;

const TemplateSkillFamilyPicker: Story<SkillFamilyPickerProps> = (args) => {
  return <SkillFamilyPicker {...args} />;
};

export const SkillFamilyPickerStory = TemplateSkillFamilyPicker.bind({});
