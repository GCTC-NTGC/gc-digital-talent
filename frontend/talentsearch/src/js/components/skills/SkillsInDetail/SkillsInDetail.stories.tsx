import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import { fakeSkills } from "@common/fakeData";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import SkillsInDetail, { SkillsInDetailProps } from "./SkillsInDetail";
import { FormSkills } from "../../experienceForm/types";

export default {
  component: SkillsInDetail,
  title: "Skills/SkillsInDetail",
  args: {
    skills: [],
    handleDelete: action("Remove from experience"),
  },
} as Meta;

const TemplateSkillsInDetail: Story<SkillsInDetailProps> = (args) => {
  const { skills } = args;
  return (
    <Form onSubmit={action("submit")}>
      <SkillsInDetail {...args} />
      {skills.length !== 0 && <Submit />}
    </Form>
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
    name: skill.name,
    details: skill.experienceSkillRecord?.details || "",
  })) as FormSkills,
};

ManySkills.args = {
  skills: fakeSkills(5).map((skill) => ({
    id: skill.id,
    name: skill.name,
    details: skill.experienceSkillRecord?.details || "",
  })) as FormSkills,
};
