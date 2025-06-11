import { StoryFn, Meta } from "@storybook/react-vite";

import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData, Pool, PoolStatus } from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import {
  PoolAdvertisement_Fragment,
  PoolPoster,
} from "./PoolAdvertisementPage";

const fakePool: Pool = fakePools(1)[0];
const openPool = {
  ...fakePool,
  status: { value: PoolStatus.Published, label: {} },
  publishedAt: FAR_PAST_DATE,
  closingReason: null,
  closingDate: FAR_FUTURE_DATE,
};
const closedPool = {
  ...fakePool,
  status: { value: PoolStatus.Closed, label: {} },
  publishedAt: FAR_PAST_DATE,
  closingReason: null,
  closingDate: FAR_PAST_DATE,
};
const nullPool: Pool = {
  id: "uuid",
};
nullPool.id = fakePool.id; // pool will never have a null id

const closedEarlyPool = {
  ...fakePool,
  status: { value: PoolStatus.Closed, label: {} },
  publishedAt: FAR_PAST_DATE,
  closingReason: "reason",
  closingDate: FAR_PAST_DATE,
};

export default {
  component: PoolPoster,
} as Meta<typeof PoolPoster>;

const Template: StoryFn<typeof PoolPoster> = (args) => {
  const { poolQuery } = args;
  return <PoolPoster poolQuery={poolQuery} />;
};

export const Open = Template.bind({});
Open.args = {
  poolQuery: makeFragmentData(openPool, PoolAdvertisement_Fragment),
};

export const Closed = Template.bind({});
Closed.args = {
  poolQuery: makeFragmentData(closedPool, PoolAdvertisement_Fragment),
};

export const Null = Template.bind({});
Null.args = {
  poolQuery: makeFragmentData(nullPool, PoolAdvertisement_Fragment),
};

export const ClosedEarly = Template.bind({});
ClosedEarly.args = {
  poolQuery: makeFragmentData(closedEarlyPool, PoolAdvertisement_Fragment),
};
