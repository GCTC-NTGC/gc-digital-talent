import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeUsers, fakeTeams, fakeRoles } from "@gc-digital-talent/fake-data";

import TeamMembersPage from "./TeamMembersPage";

const availableRoles = fakeRoles();

const teamsData = fakeTeams(10);
const usersData = fakeUsers(10);

const teamData = {
  ...teamsData[0],
  roleAssignments: [
    { id: "assignment1", role: availableRoles[2], user: usersData[0] },
    { id: "assignment2", role: availableRoles[2], user: usersData[1] },
    { id: "assignment3", role: availableRoles[2], user: usersData[3] },
  ],
};

export default {
  component: TeamMembersPage,
  title: "Pages/Team Members Page",
  parameters: {
    themeKey: "admin",
    defaultPath: {
      path: "/en/admin/teams/:teamId/members",
      initialEntries: [`/en/admin/teams/${teamData.id}/members`],
    },
    apiResponses: {
      GetTeam: {
        data: {
          team: teamData,
        },
      },
      ListRoles: {
        data: {
          roles: availableRoles,
        },
      },
    },
  },
} as ComponentMeta<typeof TeamMembersPage>;

const Template: ComponentStory<typeof TeamMembersPage> = () => (
  <TeamMembersPage />
);

export const Default = Template.bind({});
