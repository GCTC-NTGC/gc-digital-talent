import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  PoolAdvertisement_Fragment,
  PoolPoster,
} from "./PoolAdvertisementPage";

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
  const { poolQuery } = args;
  return <PoolPoster poolQuery={poolQuery} />;
};

export const CompletedPoolPoster = Template.bind({});
CompletedPoolPoster.args = {
  poolQuery: makeFragmentData(fakePool, PoolAdvertisement_Fragment),
};

export const NullPoolPoster = Template.bind({});
NullPoolPoster.args = {
  poolQuery: makeFragmentData(nullPool, PoolAdvertisement_Fragment),
};
