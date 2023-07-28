import React from "react";
import { StoryFn } from "@storybook/react";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf, heightOf } from "storybook-helpers";

import { fakeClassifications, fakePools } from "@gc-digital-talent/fake-data";

import { HomePage } from "./ExecutiveHomePage";

const mockPools = fakePools();
const classification = fakeClassifications()[0];

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

const defaultParameters = {
  chromatic: { viewports: VIEWPORTS },
  hasDarkMode: true,
  themeKey: "default",
};

export default {
  component: HomePage,
  title: "Pages/Home Page/Executive",
};

const Template: StoryFn<typeof HomePage> = (args) => (
  <div data-h2-color="base(black) base:dark(white)">
    <HomePage {...args} />
  </div>
);

export const WithPools = Template.bind({});
WithPools.parameters = defaultParameters;
WithPools.args = {
  pools: mockPools.map((pool) => ({
    ...pool,
    classifications: [
      {
        ...classification,
        group: "EX",
      },
    ],
  })),
};

export const NoPools = Template.bind({});
NoPools.parameters = defaultParameters;
NoPools.args = {
  pools: [],
};
