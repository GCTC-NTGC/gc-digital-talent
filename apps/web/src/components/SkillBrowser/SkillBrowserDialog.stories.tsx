import type { StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker/locale/en";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import SkillBrowserDialog from "./SkillBrowserDialog";
import { SkillBrowserSkill_Fragment } from "./SkillSelection";
import type { FormValues } from "./types";

const mockSkills = getStaticSkills().map((skill) =>
  makeFragmentData(skill, SkillBrowserSkill_Fragment),
);

export default {
  component: SkillBrowserDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    query: mockSkills,
    defaultOpen: true,
  },
};

const Template: StoryFn<typeof SkillBrowserDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return <SkillBrowserDialog {...args} onSave={handleSave} />;
};

export const Default = Template.bind({});

export const ExperienceContext = Template.bind({});
ExperienceContext.args = {
  context: "experience",
};

export const LibraryContext = Template.bind({});
LibraryContext.args = {
  context: "library",
};

export const ShowcaseContext = Template.bind({});
ShowcaseContext.args = {
  context: "showcase",
};

export const ShowcaseShowMyLibraryContext = Template.bind({});
ShowcaseShowMyLibraryContext.args = {
  context: "showcase",
  inLibraryQuery: faker.helpers.arrayElements(mockSkills, 15),
};
