import type { StoryFn, Meta } from "@storybook/react-vite";

import { fakePools, toLocalizedEnum } from "@gc-digital-talent/fake-data";
import { makeFragmentData, PoolStatus } from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import {
  PoolAdvertisement_Fragment,
  PoolPoster,
} from "./PoolAdvertisementPage";

const fakePool = fakePools(1)[0];
const openPool = {
  ...fakePool,
  status: toLocalizedEnum(PoolStatus.Published, "LocalizedPoolStatus"),
  publishedAt: FAR_PAST_DATE,
  closingReason: null,
  closingDate: FAR_FUTURE_DATE,
};
const closedPool = {
  ...fakePool,
  status: toLocalizedEnum(PoolStatus.Closed, "LocalizedPoolStatus"),
  publishedAt: FAR_PAST_DATE,
  closingReason: null,
  closingDate: FAR_PAST_DATE,
};
const nullPool = {
  __typename: "Pool" as const,
  id: "uuid",
  wasClosedEarly: false,
  name: null,
  workStream: null,
  closingDate: null,
  status: null,
  language: null,
  securityClearance: null,
  department: null,
  opportunityLength: null,
  classification: null,
  yourImpact: null,
  keyTasks: null,
  whatToExpect: null,
  specialNote: null,
  whatToExpectAdmission: null,
  aboutUs: null,
  poolSkills: null,
  isRemote: null,
  location: null,
  processNumber: null,
  community: null,
  contactEmail: null,
};
nullPool.id = fakePool.id; // pool will never have a null id

const closedEarlyPool = {
  ...fakePool,
  status: toLocalizedEnum(PoolStatus.Closed, "LocalizedPoolStatus"),
  publishedAt: FAR_PAST_DATE,
  wasClosedEarly: true,
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
