import { Meta } from "@storybook/react-vite";

import { fakePools } from "@gc-digital-talent/fake-data";
import { makeFragmentData, Pool } from "@gc-digital-talent/graphql";

import PoolCard, { PoolCard_Fragment } from "./PoolCard";

const fakedPools = fakePools();
const fakedPool = fakedPools[0];

const nullPool: Pool = {
  __typename: "Pool",
  id: "uuid",
};

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

export const Default = {};

export const Null = {
  args: {
    poolQuery: makeFragmentData(nullPool, PoolCard_Fragment),
  },
};

export const WithoutWhoCanApply = {
  args: {
    poolQuery: makeFragmentData(poolWithoutWhoCanApply, PoolCard_Fragment),
  },
};
