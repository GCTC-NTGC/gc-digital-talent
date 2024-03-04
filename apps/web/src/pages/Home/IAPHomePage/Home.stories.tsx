import React from "react";
import type { Meta, Story } from "@storybook/react";

import { THEMES, allModes } from "@gc-digital-talent/storybook-helpers";
import NestedLanguageProvider from "@gc-digital-talent/i18n/src/components/NestedLanguageProvider";
import { Messages } from "@gc-digital-talent/i18n";

import * as micMessages from "~/lang/micCompiled.json";
import * as crgMessages from "~/lang/crgCompiled.json";
import * as crkMessages from "~/lang/crkCompiled.json";
import * as ojwMessages from "~/lang/ojwCompiled.json";

import { Home } from "./Home";

const messages: Map<string, Messages> = new Map([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

export default {
  component: Home,
  title: "Pages/Home Page/IAP",
  parameters: {
    layout: "fullscreen",
    themes: {
      themeOverride: THEMES.iap.light,
    },
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: Story = () => (
  <NestedLanguageProvider messages={messages}>
    <Home />
  </NestedLanguageProvider>
);

export const Default = Template.bind({});
