import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakePools, fakeTeams } from "@gc-digital-talent/fake-data";

import { PoolTable } from "./PoolTable";

const mockPools = fakePools();
const mockTeams = fakeTeams();

const mockPoolsWithTeam = mockPools.flatMap((pool) => {
  return mockTeams.map((team) => ({
    ...pool,
    team: {
      id: team.id,
      name: team.name,
      displayName: team.displayName,
    },
  }));
});

export default {
  component: PoolTable,
  title: "Tables/Pool Table",
} as Meta<typeof PoolTable>;

const Template: StoryFn<typeof PoolTable> = (args) => {
  const { pools, title } = args;
  return <PoolTable pools={pools} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  pools: mockPoolsWithTeam,
  title: "Pools",
};
