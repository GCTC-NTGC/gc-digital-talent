import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "storybook-helpers";

import FindASkillDialog, { FormValues } from "./FindASkillDialog";

const mockSkills = getStaticSkills();

export default {
  component: FindASkillDialog,
  title: "Components/Dialog/SkillDialog/FindASkillDialog",
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof FindASkillDialog>;

const Template: ComponentStory<typeof FindASkillDialog> = (args) => {
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
