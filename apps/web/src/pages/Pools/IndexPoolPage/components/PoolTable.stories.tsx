import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import fakePools from "@common/fakeData/fakePools";

import { PoolTable } from "./PoolTable";

const mockPools = fakePools();

export default {
  component: PoolTable,
  title: "Tables/Pool Table",
} as ComponentMeta<typeof PoolTable>;

const Template: ComponentStory<typeof PoolTable> = (args) => {
  const { pools } = args;
  return <PoolTable pools={pools} />;
};

export const Default = Template.bind({});
Default.args = {
  pools: mockPools,
};
