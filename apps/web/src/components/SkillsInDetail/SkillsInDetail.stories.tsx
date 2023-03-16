import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import { BasicForm, Submit } from "@gc-digital-talent/forms";

import { FormSkills } from "~/pages/Profile/ExperienceFormPage/types";
import SkillsInDetail, { SkillsInDetailProps } from "./SkillsInDetail";

export default {
  component: SkillsInDetail,
  title: "Components/Skills In Detail",
  args: {
    skills: [],
    handleDelete: action("Remove from experience"),
  },
} as Meta;

const TemplateSkillsInDetail: Story<SkillsInDetailProps> = (args) => {
  const { skills } = args;
  return (
    <BasicForm onSubmit={action("submit")}>
      <SkillsInDetail {...args} />
      {skills.length !== 0 && <Submit />}
    </BasicForm>
  );
};

export const NoSkills = TemplateSkillsInDetail.bind({});
export const FewSkills = TemplateSkillsInDetail.bind({});
export const ManySkills = TemplateSkillsInDetail.bind({});

NoSkills.args = {
  skills: [],
};

FewSkills.args = {
  skills: fakeSkills(2).map((skill) => ({
    id: skill.id,
    skillId: skill.id,
    name: skill.name,
    details: skill.experienceSkillRecord?.details || "",
  })) as FormSkills,
};

ManySkills.args = {
  skills: fakeSkills(5).map((skill) => ({
    id: skill.id,
    skillId: skill.id,
    name: skill.name,
    details: skill.experienceSkillRecord?.details || "",
  })) as FormSkills,
};
