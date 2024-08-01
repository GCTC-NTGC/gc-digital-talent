import { Meta, StoryFn } from "@storybook/react";

import {
  fakeUsers,
  fakeCommunities,
  fakeRoles,
} from "@gc-digital-talent/fake-data";

import CommunityMembersPage from "./CommunityMembersPage";

const availableRoles = fakeRoles();

const communitiesData = fakeCommunities(10);
const usersData = fakeUsers(10);

const communityData = {
  ...communitiesData[0],
  roleAssignments: [
    { id: "assignment1", role: availableRoles[2], user: usersData[0] },
    { id: "assignment2", role: availableRoles[2], user: usersData[1] },
    { id: "assignment3", role: availableRoles[2], user: usersData[3] },
  ],
};

export default {
  component: CommunityMembersPage,
  parameters: {
    defaultPath: {
      path: "/en/admin/communities/:communityId/members",
      initialEntries: [`/en/admin/communities/${communityData.id}/members`],
    },
    apiResponses: {
      CommunityMembersCommunity: {
        data: {
          community: communityData,
        },
      },
      CommunityName: {
        data: {
          community: communityData,
        },
      },
      // eslint-disable-next-line camelcase
      CommunityMembers_AvailableUsers: {
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
} as Meta<typeof CommunityMembersPage>;

const Template: StoryFn<typeof CommunityMembersPage> = () => (
  <CommunityMembersPage />
);

export const Default = Template.bind({});
