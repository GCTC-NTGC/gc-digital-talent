import React from "react";
import { StoryFn } from "@storybook/react";

import { action } from "@storybook/addon-actions";
import { getStaticSkills, fakeExperiences } from "@gc-digital-talent/fake-data";
import { OverlayOrDialogDecorator } from "storybook-helpers";

import AddASkillToLibraryDialog, {
  FormValues,
} from "./AddASkillToLibraryDialog";

const mockSkills = getStaticSkills();
const mockExperiences = fakeExperiences(5);

export default {
  component: AddASkillToLibraryDialog,
  title: "Components/Dialog/Skill Dialog/Add A Skill To Library",
  decorators: [OverlayOrDialogDecorator],
};

const Template: StoryFn<typeof AddASkillToLibraryDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        action("onSave")(values);
        resolve();
      }, 1000);
    });
  };

  return <AddASkillToLibraryDialog {...args} onSave={handleSave} />;
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
  experiences: mockExperiences,
};
