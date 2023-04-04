import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof PoolTable>;

const Template: ComponentStory<typeof PoolTable> = (args) => {
  const { pools } = args;
  return <PoolTable pools={pools} />;
};

export const Default = Template.bind({});
Default.args = {
  pools: mockPoolsWithTeam,
};
