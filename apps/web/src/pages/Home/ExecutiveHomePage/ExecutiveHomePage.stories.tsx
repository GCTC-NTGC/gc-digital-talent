import type { StoryFn } from "@storybook/react-vite";

import { allModes } from "@gc-digital-talent/storybook-helpers";
import { fakeClassifications, fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { ExecutiveHomePagePools_Fragment, HomePage } from "./ExecutiveHomePage";

const mockPools = fakePools(4);
const classification = fakeClassifications("EX", {
  __typename: "LocalizedString",
  en: "Executive group",
  fr: "Groupe de la direction",
  localized: "Executive Group",
})[0];

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
  query: mockPools.map((pool) =>
    makeFragmentData(
      {
        ...pool,
        classification,
      },
      ExecutiveHomePagePools_Fragment,
    ),
  ),
};

export const NoPools = Template.bind({});
NoPools.parameters = defaultParameters;
NoPools.args = {
  query: [],
};
