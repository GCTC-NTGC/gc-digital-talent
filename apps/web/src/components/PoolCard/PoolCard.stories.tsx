import { StoryFn, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData, Pool } from "@gc-digital-talent/graphql";

import PoolCard, { PoolCard_Fragment } from "./PoolCard";

const fakedPools = fakePools();
const fakedPool = fakedPools[0];
const fakedPoolNull = fakedPools[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakedPoolNull).forEach((key) => {
  nullPool[key] = null;
});

const poolWithoutWhoCanApply: Pool = {
  ...fakedPool,
  areaOfSelection: null,
  selectionLimitations: [],
};

export default {
  component: PoolCard,
  args: {
    poolQuery: makeFragmentData(fakedPool, PoolCard_Fragment),
  },
} as Meta;

const Template: StoryFn<typeof PoolCard> = (args) => <PoolCard {...args} />;

export const Default = Template.bind({});

export const Null = Template.bind({});
Null.args = {
  poolQuery: makeFragmentData(nullPool, PoolCard_Fragment),
};

export const WithoutWhoCanApply = Template.bind({});
WithoutWhoCanApply.args = {
  poolQuery: makeFragmentData(poolWithoutWhoCanApply, PoolCard_Fragment),
};
