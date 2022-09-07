import React from "react";
import type { Meta, Story } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "@common/helpers/storybookUtils";
import Home from "./Home";

export default {
  component: Home,
  title: "Indigenous Apprenticeship/Home Page",
  parameters: {
    backgrounds: {
      default: "white",
    },
  },
} as Meta;

const Template: Story = () => <Home />;

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
