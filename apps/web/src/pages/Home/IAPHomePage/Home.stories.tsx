import React from "react";
import type { Meta, StoryFn } from "@storybook/react";

import {
  THEMES,
  allModes,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { NestedLanguageProvider, Messages } from "@gc-digital-talent/i18n";
import { fakePools } from "@gc-digital-talent/fake-data";
import { PublishingGroup } from "@gc-digital-talent/graphql";

import * as micMessages from "~/lang/micCompiled.json";
import * as crgMessages from "~/lang/crgCompiled.json";
import * as crkMessages from "~/lang/crkCompiled.json";
import * as ojwMessages from "~/lang/ojwCompiled.json";

import { Home } from "./Home";

const mockPools = fakePools(1);
const IAPPool = {
  ...mockPools[0],
  publishingGroup: PublishingGroup.Iap,
};

const messages: Map<string, Messages> = new Map([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

export default {
  component: Home,
  decorators: [MockGraphqlDecorator],
  title: "Pages/Home Page/IAP",
  parameters: {
    apiResponsesConfig: {
      latency: {
        min: 0,
        max: 0,
      },
    },
    apiResponses: {
      IAPHomePage_Query: {
        data: {
          publishedPools: [IAPPool],
        },
      },
    },
    layout: "fullscreen",
    chromatic: {
      mode: {
        mobile: allModes.mobile,
      },
    },
  },
} as Meta;

const Template: StoryFn = () => (
  <NestedLanguageProvider messages={messages}>
    <Home />
  </NestedLanguageProvider>
);

export const Default = Template.bind({});
Default.parameters = {
  themes: {
    themeOverride: THEMES.iap.light,
  },
};

export const French = Template.bind({});
French.parameters = {
  themes: {
    themeOverride: THEMES.iap.light,
  },
  locale: "fr",
  chromatic: { delay: 2000 },
};

export const Dark = Template.bind({});
Dark.parameters = {
  themes: {
    themeOverride: THEMES.iap.dark,
  },
};
