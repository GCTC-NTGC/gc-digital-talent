import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Home from "./HomePage";

export default {
  component: Home,
  title: "Pages/Home Page/Digital Talent",
} as Meta;

const Template: StoryFn<typeof Home> = () => <Home defaultImage={0} />;

export const Default = Template.bind({});
Default.parameters = {
  layout: "fullscreen",
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export const French = Template.bind({});
French.parameters = {
  layout: "fullscreen",
  locale: "fr",
};
