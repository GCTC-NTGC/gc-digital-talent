import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeSkills } from "@common/fakeData";
import SkillResults, {
  SkillResultsProps,
} from "../../components/skills/SkillResults";

const skills = fakeSkills();

export default {
  component: SkillResults,
  title: "Search Results",
  args: {
    title: "Results",
    skills,
    addedSkills: [skills[0], skills[1]],
    handleAddSkill: action("handleAddSkill"),
    handleRemoveSkill: action("handleRemoveSkill"),
  },
} as Meta;

const TemplateSkillResults: Story<SkillResultsProps> = (args) => (
  <SkillResults {...args} />
);

export const skillResults = TemplateSkillResults.bind({});
