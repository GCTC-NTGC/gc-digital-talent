import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeUsers, fakeTeams, fakeRoles } from "@gc-digital-talent/fake-data";

import UpdateUserPage from "./UpdateUserPage";

const availableRoles = fakeRoles();
const teamsData = fakeTeams(10);

const userData = {
  ...fakeUsers(1)[0],
  authInfo: {
    roleAssignments: [
      { id: "assignment1", role: availableRoles[0] },
      { id: "assignment2", role: availableRoles[2], team: teamsData[0] },
    ],
  },
};

export default {
  component: UpdateUserPage,
  title: "Pages/Update User Page",
  parameters: {
    defaultPath: {
      path: "/en/admin/users/:userId/edit",
      initialEntries: [`/en/admin/users/${userData.id}/edit`],
    },
    apiResponses: {
      ListRoles: {
        data: {
          roles: availableRoles,
        },
      },
      AddTeamRoleName: {
        data: {
          teams: teamsData,
        },
      },
    },
  },
} as Meta<typeof UpdateUserPage>;

const Template: StoryFn<typeof UpdateUserPage> = () => <UpdateUserPage />;

export const Default = Template.bind({});
Default.parameters = {
  apiResponses: {
    UpdateUserData: {
      data: {
        user: userData,
        roles: availableRoles,
      },
    },
  },
};
