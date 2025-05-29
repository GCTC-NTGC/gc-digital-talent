import { Meta, StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Home from "./HomePage";

export default {
  component: Home,
} as Meta;

const Template: StoryFn<typeof Home> = () => <Home defaultImage={0} />;

export const Default = {
  render: Template,

  parameters: {
    layout: "fullscreen",
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
        french: allModes.french,
      },
    },
  },
};
