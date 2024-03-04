import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Home from "./HomePage";

type Meta = ComponentMeta<typeof Home>;
type Story = ComponentStory<typeof Home>;

export default {
  component: Home,
  title: "Pages/Home Page/Digital Talent",
} as Meta;

const Template: Story = () => <Home defaultImage={0} />;

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
