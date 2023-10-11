import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import Toast from "@gc-digital-talent/toast";
import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { Skill } from "@gc-digital-talent/graphql";

import SkillBrowser from "./SkillBrowser";
import { FormValues } from "./types";
import { BasicForm } from "@gc-digital-talent/forms";
import { Button } from "@gc-digital-talent/ui";

const mockSkills = getStaticSkills();

export default {
  component: SkillBrowser,
  title: "Components/Skill Browser/Inline",
  args: {
    skills: mockSkills,
    name: "skills",
  },
};

const Template: StoryFn<typeof SkillBrowser> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return (
    <>
      <BasicForm onSubmit={handleSave}>
        <SkillBrowser {...args} />
        <Button type="submit">Submit</Button>
      </BasicForm>
    </>
  );
};

export const Default = Template.bind({});
