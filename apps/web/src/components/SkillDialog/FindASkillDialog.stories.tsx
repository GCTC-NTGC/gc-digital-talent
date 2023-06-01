import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "storybook-helpers";

import FindASkillDialog, { FormValues } from "./FindASkillDialog";

const mockSkills = getStaticSkills();

export default {
  component: FindASkillDialog,
  title: "Components/Dialog/Skill Dialog/Find a Skill",
  decorators: [OverlayOrDialogDecorator],
};

const Template: StoryFn<typeof FindASkillDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return <FindASkillDialog {...args} onSave={handleSave} />;
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
};
