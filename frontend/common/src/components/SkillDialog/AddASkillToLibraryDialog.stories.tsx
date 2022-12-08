import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { action } from "@storybook/addon-actions";
import { getStaticSkills, fakeExperiences } from "../../fakeData";
import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

import AddASkillToLibraryDialog, {
  FormValues,
} from "./AddASkillToLibraryDialog";

const mockSkills = getStaticSkills();
const mockExperiences = fakeExperiences(5);

export default {
  component: AddASkillToLibraryDialog,
  title: "Components/Dialog/SkillDialog/AddASkillToLibraryDialog",
  decorators: [OverlayOrDialogDecorator],
} as ComponentMeta<typeof AddASkillToLibraryDialog>;

const Template: ComponentStory<typeof AddASkillToLibraryDialog> = (args) => {
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
