import React from "react";
import type { Meta, Story } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import {
  widthOf,
  heightOf,
  NestedLanguageProviderDecorator,
} from "storybook-helpers";

import Home from "./Home";

export default {
  component: Home,
  title: "Pages/Home Page/IAP",
  decorators: [NestedLanguageProviderDecorator],
  parameters: {
    backgrounds: {
      default: "white",
      values: [{ name: "white", value: "#fff" }],
    },
    themeKey: "iap", // Set the default theme to IAP
  },
} as Meta;

const Template: Story = () => <Home />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
