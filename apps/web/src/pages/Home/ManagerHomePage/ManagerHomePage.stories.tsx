import React from "react";
import { StoryFn } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";

import ManagerHomePage from "./ManagerHomePage";

export default {
  component: ManagerHomePage,
  title: "Pages/Home Page/Manager",
};

const Template: StoryFn = () => (
  <div data-h2-color="base(black) base:dark(white)">
    <ManagerHomePage />
  </div>
);

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};
