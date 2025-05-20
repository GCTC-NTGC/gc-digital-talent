import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";

import { fakeSkills } from "@gc-digital-talent/fake-data";
import BasicForm from "@gc-digital-talent/forms/BasicForm";

import SkillsInDetail from "./SkillsInDetail";

export default {
  component: SkillsInDetail,
  args: {
    skills: [],
    onDelete: (skillId: string) =>
      action("Remove skill from experience")(skillId),
  },
};

const Template: StoryFn<typeof SkillsInDetail> = (args) => {
  return (
    <BasicForm onSubmit={action("submit")}>
      <SkillsInDetail {...args} />
    </BasicForm>
  );
};

const fakeSkill = fakeSkills(1)[0];

export const Default = Template.bind({});
Default.args = {
  skills: [
    {
      id: fakeSkill.id,
      skillId: fakeSkill.id,
      name: fakeSkill.name,
      details: "",
    },
  ],
};
