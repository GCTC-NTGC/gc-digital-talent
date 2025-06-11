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

export const WithPools = {
  parameters: defaultParameters,

  args: {
    pools: mockPools.map((pool) => ({
      ...pool,
      classification: {
        ...classification,
        group: "EX",
      },
    })),
  },
};

export const NoPools = {
  parameters: defaultParameters,

  args: {
    pools: [],
  },
};
