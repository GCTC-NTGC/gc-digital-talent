import React from "react";
import type { Meta, Story } from "@storybook/react";

import {
  CHROMATIC_VIEWPORTS,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import NestedLanguageProvider from "@gc-digital-talent/i18n/src/components/NestedLanguageProvider";
import { Messages } from "@gc-digital-talent/i18n";
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
    backgrounds: {
      default: "white",
      values: [{ name: "white", value: "#fff" }],
    },
    themeKey: "iap", // Set the default theme to IAP
  },
} as Meta;

const Template: Story = () => (
  <NestedLanguageProvider messages={messages}>
    <Home />
  </NestedLanguageProvider>
);

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
