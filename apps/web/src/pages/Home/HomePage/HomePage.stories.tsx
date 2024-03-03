import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  CHROMATIC_VIEWPORTS,
  THEMES,
} from "@gc-digital-talent/storybook-helpers";

import Home from "./HomePage";

type Meta = ComponentMeta<typeof Home>;
type Story = ComponentStory<typeof Home>;

export default {
  component: Home,
  title: "Pages/Home Page/Digital Talent",
} as Meta;

const Template: Story = () => (
  <div data-h2-color="base(black) base:dark(white)">
    <Home defaultImage={0} />
  </div>
);

export const Default = Template.bind({});
Default.parameters = {
  chromatic: {
    modes: {
      light: {
        theme: THEMES.default.light,
      },
      "light mobile": {
        theme: THEMES.default.light,
        viewport: CHROMATIC_VIEWPORTS[1],
      },
      dark: {
        theme: THEMES.default.dark,
      },
    },
  },
};
