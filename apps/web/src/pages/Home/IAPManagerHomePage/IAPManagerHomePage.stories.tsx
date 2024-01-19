import React from "react";
import type { Meta, Story } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import { IAPManagerHomePage } from "./IAPManagerHomePage";

export default {
  component: IAPManagerHomePage,
  title: "Pages/IAP Manager Home Page",
  parameters: {
    backgrounds: {
      default: "white",
      values: [{ name: "white", value: "#fff" }],
    },
    themeKey: "iap", // Set the default theme to IAP
  },
} as Meta;

const Template: Story = () => <IAPManagerHomePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
