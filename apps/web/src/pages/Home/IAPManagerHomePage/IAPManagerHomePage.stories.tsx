import React from "react";
import type { Meta, Story } from "@storybook/react";

import {
  CHROMATIC_VIEWPORTS,
  THEMES,
} from "@gc-digital-talent/storybook-helpers";

import { IAPManagerHomePage } from "./IAPManagerHomePage";

export default {
  component: IAPManagerHomePage,
  title: "Pages/IAP Manager Home Page",
  parameters: {
    layout: "fullscreen",
    themes: {
      themeOverride: THEMES.iap.light,
    },
  },
} as Meta;

const Template: Story = () => <IAPManagerHomePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
