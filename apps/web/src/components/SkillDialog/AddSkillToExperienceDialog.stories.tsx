import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "storybook-helpers";

import AddSkillToExperienceDialog, {
  FormValues,
} from "./AddSkillToExperienceDialog";

const mockSkills = getStaticSkills();

export default {
  component: AddSkillToExperienceDialog,
  title: "Components/Dialog/SkillDialog/AddSkillToExperienceDialog",
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof AddSkillToExperienceDialog>;

const Template: ComponentStory<typeof AddSkillToExperienceDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        action("onSave")(values);
        resolve();
      }, 1000);
    });
  };

  return <AddSkillToExperienceDialog {...args} onSave={handleSave} />;
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
};

export const WithinApplication = Template.bind({});
WithinApplication.args = {
  skills: mockSkills,
  isApplication: true,
};
