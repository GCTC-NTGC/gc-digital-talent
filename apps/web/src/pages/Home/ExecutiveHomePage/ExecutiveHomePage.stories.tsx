import React from "react";
import { StoryFn } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";
import { fakeClassifications, fakePools } from "@gc-digital-talent/fake-data";

import { HomePage } from "./ExecutiveHomePage";

const mockPools = fakePools(4);
const classification = fakeClassifications()[0];

const defaultParameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
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
