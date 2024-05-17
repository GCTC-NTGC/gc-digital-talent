import { Meta, StoryFn } from "@storybook/react";

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
  parameters: {
    defaultPath: {
      path: "/en/admin/teams/:teamId/members",
      initialEntries: [`/en/admin/teams/${teamData.id}/members`],
    },
    apiResponses: {
      TeamMembersTeam: {
        data: {
          team: teamData,
        },
      },
      TeamName: {
        data: {
          team: teamData,
        },
      },
      // eslint-disable-next-line camelcase
      TeamMembers_AvailableUsers: {
        data: {
          users: usersData,
        },
      },
      AvailableUserRoles: {
        data: {
          roles: availableRoles,
        },
      },
    },
  },
} as Meta<typeof TeamMembersPage>;

const Template: StoryFn<typeof TeamMembersPage> = () => <TeamMembersPage />;

export const Default = Template.bind({});
