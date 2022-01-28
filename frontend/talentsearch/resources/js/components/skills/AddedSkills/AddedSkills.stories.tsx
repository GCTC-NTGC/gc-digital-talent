import React from "react";
import { Meta, Story } from "@storybook/react";
import fakeSkills from "@common/fakeData/fakeSkills";
import AddedSkills, { AddedSkillsProps } from ".";

export default {
  component: AddedSkills,
  title: "Skills/AddedSkills",
  args: {
    skills: fakeSkills(),
  },
  argTypes: {
    onRemoveSkill: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateAddedSkillsNone: Story<AddedSkillsProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  skills,
  ...rest
}) => {
  return <AddedSkills skills={[]} {...rest} />;
};

const TemplateAddedSkillsFew: Story<AddedSkillsProps> = ({
  skills,
  ...rest
}) => {
  return <AddedSkills skills={skills.slice(0, 3)} {...rest} />;
};

const TemplateAddedSkillsMany: Story<AddedSkillsProps> = ({
  skills,
  ...rest
}) => {
  return <AddedSkills skills={skills} {...rest} />;
};

export const NoSkills = TemplateAddedSkillsNone.bind({});
export const FewSkills = TemplateAddedSkillsFew.bind({});
export const ManySkills = TemplateAddedSkillsMany.bind({});
