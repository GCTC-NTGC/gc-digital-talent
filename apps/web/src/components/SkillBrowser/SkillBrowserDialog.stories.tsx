import { StoryFn } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker/locale/en";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { Skill } from "@gc-digital-talent/graphql";

import SkillBrowserDialog from "./SkillBrowserDialog";
import { FormValues } from "./types";

const mockSkills = getStaticSkills();

export default {
  component: SkillBrowserDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    skills: mockSkills,
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

export const Default = {
  render: Template,
};

export const ExperienceContext = {
  render: Template,

  args: {
    context: "experience",
  },
};

export const LibraryContext = {
  render: Template,

  args: {
    context: "library",
  },
};

export const ShowcaseContext = {
  render: Template,

  args: {
    context: "showcase",
  },
};

export const ShowcaseShowMyLibraryContext = {
  render: Template,

  args: {
    context: "showcase",
    inLibrary: faker.helpers.arrayElements<Skill>(mockSkills, 15),
  },
};
