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
  title: "Pages/Process Page",
} as Meta<typeof PoolPoster>;

const Template: StoryFn<typeof PoolPoster> = (args) => {
  const { pool } = args;
  return <PoolPoster pool={pool} />;
};

export const Completed = Template.bind({});
Completed.args = { pool: fakePool };

export const Null = Template.bind({});
Null.args = { pool: nullPool };
