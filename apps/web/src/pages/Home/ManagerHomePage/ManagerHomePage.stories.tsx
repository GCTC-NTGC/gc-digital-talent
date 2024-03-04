import React from "react";
import { StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import ManagerHomePage from "./ManagerHomePage";

export default {
  component: ManagerHomePage,
  title: "Pages/Home Page/Manager",
};

const Template: StoryFn = () => <ManagerHomePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};
