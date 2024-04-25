import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";

import PoolCard from "./PoolCard";

const fakedPools = fakePools();
const fakedPool = fakedPools[0];
const fakedPoolNull = fakedPools[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakedPoolNull).forEach((key) => {
  nullPool[key] = null;
});

export default {
  component: PoolCard,
  args: {
    pool: fakedPool,
  },
} as Meta;

const Template: StoryFn<typeof PoolCard> = (args) => <PoolCard {...args} />;

export const Default = Template.bind({});

export const Null = Template.bind({});
Null.args = {
  pool: nullPool,
};
