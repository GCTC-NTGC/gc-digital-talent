import { StoryFn } from "@storybook/react";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import { fakeClassifications, fakePools } from "@gc-digital-talent/fake-data";

import { HomePage } from "./ExecutiveHomePage";

const mockPools = fakePools(4);
const classification = fakeClassifications()[0];

const defaultParameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export default {
  component: HomePage,
};

const Template: StoryFn<typeof HomePage> = (args) => <HomePage {...args} />;

export const WithPools = Template.bind({});
WithPools.parameters = defaultParameters;
WithPools.args = {
  pools: mockPools.map((pool) => ({
    ...pool,
    classification: {
      ...classification,
      group: "EX",
    },
  })),
};

export const NoPools = Template.bind({});
NoPools.parameters = defaultParameters;
NoPools.args = {
  pools: [],
};
