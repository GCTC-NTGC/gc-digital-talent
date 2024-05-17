import { Meta, StoryFn } from "@storybook/react";

import { fakeTeams } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { TeamTable, TeamTable_TeamFragment } from "./TeamTable";
import { MyRoleTeam } from "./types";

const mockTeams = fakeTeams();

const mockTeamFragments = mockTeams.map((mockTeam) =>
  makeFragmentData(mockTeam, TeamTable_TeamFragment),
);

const mockRolesAndTeams: MyRoleTeam[] = [
  {
    teamId: mockTeams[0].id,
    roleName: {
      en: "Role 1 EN",
      fr: "Role 1 FR",
    },
  },
  {
    teamId: mockTeams[0].id,
    roleName: {
      en: "Role 2 EN",
      fr: "Role 2 FR",
    },
  },
];

export default {
  component: TeamTable,
} as Meta<typeof TeamTable>;

const Template: StoryFn<typeof TeamTable> = (args) => {
  const { teamsQuery, myRolesAndTeams, title } = args;
  return (
    <TeamTable
      teamsQuery={teamsQuery}
      myRolesAndTeams={myRolesAndTeams}
      title={title}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  teamsQuery: mockTeamFragments,
  myRolesAndTeams: mockRolesAndTeams,
  title: "Teams",
};
