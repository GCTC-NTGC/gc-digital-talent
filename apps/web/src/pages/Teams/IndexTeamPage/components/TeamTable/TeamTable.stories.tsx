import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeTeams } from "@gc-digital-talent/fake-data";

import { TeamTable } from "./TeamTable";
import { MyRoleTeam } from "./types";

const mockTeams = fakeTeams();

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
  title: "Tables/Team Table",
} as ComponentMeta<typeof TeamTable>;

const Template: ComponentStory<typeof TeamTable> = (args) => {
  const { teams, myRolesAndTeams, title } = args;
  return (
    <TeamTable teams={teams} myRolesAndTeams={myRolesAndTeams} title={title} />
  );
};

export const Default = Template.bind({});
Default.args = {
  teams: mockTeams,
  myRolesAndTeams: mockRolesAndTeams,
  title: "Teams",
};
