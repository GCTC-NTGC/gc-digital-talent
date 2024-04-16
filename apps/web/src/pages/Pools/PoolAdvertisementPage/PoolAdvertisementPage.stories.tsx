import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";

import { PoolPoster } from "./PoolAdvertisementPage";

const fakePool = fakePools(1)[0];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullPool: any = {};
Object.keys(fakePool).forEach((key) => {
  nullPool[key] = null;
});
nullPool.id = fakePool.id; // pool will never have a null id

export default {
  component: PoolPoster,
  title: "Pages/Pool Poster",
} as Meta<typeof PoolPoster>;

const Template: StoryFn<typeof PoolPoster> = (args) => {
  const { pool } = args;
  return <PoolPoster pool={pool} />;
};

export const CompletedPoolPoster = Template.bind({});
CompletedPoolPoster.args = { pool: fakePool };

export const NullPoolPoster = Template.bind({});
NullPoolPoster.args = { pool: nullPool };
