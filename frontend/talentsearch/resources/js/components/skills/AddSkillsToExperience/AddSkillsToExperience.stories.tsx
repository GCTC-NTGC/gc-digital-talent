import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakeSkills, fakeSkillFamilies } from "@common/fakeData";
import AddSkillsToExperience, { AddSkillsToExperienceProps } from ".";

const skills = fakeSkills(15, fakeSkillFamilies(4));

export default {
  component: AddSkillsToExperience,
  title: "Skills/Add Skills To Experience",
  args: {
    allSkills: skills,
    frequentSkills: skills.slice(0, 10),
    addedSkills: skills.slice(7, 12),
  },
  argTypes: {
    onRemoveSkill: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateAddedSkillsFew: Story<AddSkillsToExperienceProps> = (args) => {
  return <AddSkillsToExperience {...args} />;
};

export const FewSkills = TemplateAddedSkillsFew.bind({});
