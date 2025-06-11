import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  CHROMATIC_VIEWPORTS,
  THEMES,
} from "@gc-digital-talent/storybook-helpers";

import IAPManagerHomePage from "./IAPManagerHomePage";

export default {
  component: IAPManagerHomePage,
  parameters: {
    layout: "fullscreen",
    themes: {
      themeOverride: THEMES.iap.light,
    },
  },
} as Meta;

const Template: StoryFn = () => <IAPManagerHomePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
