import { Meta, StoryFn } from "@storybook/react";

import { fakePools, fakeTeams } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { PoolTable, PoolTableRow_Fragment } from "./PoolTable";

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
} as Meta<typeof PoolTable>;

const Template: StoryFn<typeof PoolTable> = (args) => {
  const { poolsQuery, title } = args;
  return <PoolTable poolsQuery={poolsQuery} title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  poolsQuery: mockPoolsWithTeam.map((pool) =>
    makeFragmentData(pool, PoolTableRow_Fragment),
  ),
  title: "Pools",
};
