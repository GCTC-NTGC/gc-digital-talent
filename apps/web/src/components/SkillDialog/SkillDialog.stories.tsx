import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "storybook-helpers";

import SkillDialog, { FormValues } from "./SkillDialog";

const mockSkills = getStaticSkills();

export default {
  component: SkillDialog,
  title: "Components/Dialog/Skill Dialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    skills: mockSkills,
    defaultOpen: true,
  },
};

const Template: StoryFn<typeof SkillDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return <SkillDialog {...args} onSave={handleSave} />;
};

export const Default = Template.bind({});

export const ExperienceContext = Template.bind({});
ExperienceContext.args = {
  context: "experience",
};

export const LibraryContext = Template.bind({});
LibraryContext.args = {
  context: "library",
  showCategory: false,
};
