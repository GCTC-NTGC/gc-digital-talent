import type { StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { BasicForm } from "@gc-digital-talent/forms";
import { Button } from "@gc-digital-talent/ui";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import SkillBrowser from "./SkillBrowser";
import { SkillBrowserSkill_Fragment } from "./SkillSelection";
import type { FormValues } from "./types";

const mockSkills = getStaticSkills().map((skill) =>
  makeFragmentData(skill, SkillBrowserSkill_Fragment),
);

export default {
  component: SkillBrowser,
  args: {
    query: mockSkills,
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
    <BasicForm onSubmit={handleSave}>
      <SkillBrowser {...args} />
      <Button type="submit">Submit</Button>
    </BasicForm>
  );
};

export const Default = Template.bind({});
