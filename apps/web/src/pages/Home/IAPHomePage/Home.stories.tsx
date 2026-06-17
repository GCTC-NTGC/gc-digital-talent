import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  THEMES,
  allModes,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import type { Messages } from "@gc-digital-talent/i18n";
import { NestedLanguageProvider } from "@gc-digital-talent/i18n";
import { fakePools } from "@gc-digital-talent/fake-data";
import { PublishingGroup } from "@gc-digital-talent/graphql";

import * as micMessages from "~/lang/micCompiled.json" with { type: "json" };
import * as crgMessages from "~/lang/crgCompiled.json" with { type: "json" };
import * as crkMessages from "~/lang/crkCompiled.json" with { type: "json" };
import * as ojwMessages from "~/lang/ojwCompiled.json" with { type: "json" };

import { Home } from "./Home";

const mockPools = fakePools(1);
const IAPPool = {
  ...mockPools[0],
  publishingGroup: PublishingGroup.Iap,
};

const messages = new Map<string, Messages>([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

export default {
  component: Home,
  decorators: [MockGraphqlDecorator],
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
      modes: {
        light: allModes["light iap desktop"],
        "light mobile": allModes["light mobile"],
        dark: allModes["dark iap desktop"],
        french: allModes["iap french"],
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
