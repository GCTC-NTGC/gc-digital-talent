import { Meta, StoryFn } from "@storybook/react";

import {
  fakeUsers,
  fakeCommunities,
  fakeRoles,
} from "@gc-digital-talent/fake-data";
import {
  makeFragmentData,
  UserPublicProfile,
} from "@gc-digital-talent/graphql";

import CommunityMembersPage from "./CommunityMembersPage";
import { CommunityMembersPage_CommunityFragment } from "./components/operations";

const availableRoles = fakeRoles();

const communitiesData = fakeCommunities(10);
const usersData = fakeUsers(10).map(
  (user) =>
    ({
      ...user,
      __typename: "UserPublicProfile",
    }) as UserPublicProfile,
);

const communityData = makeFragmentData(
  {
    ...communitiesData[0],
    roleAssignments: [
      { id: "assignment1", role: availableRoles[2], user: usersData[0] },
      { id: "assignment2", role: availableRoles[2], user: usersData[1] },
      { id: "assignment3", role: availableRoles[2], user: usersData[3] },
    ],
  },
  CommunityMembersPage_CommunityFragment,
);

export default {
  component: CommunityMembersPage,
  parameters: {
    defaultPath: {
      path: "/en/admin/communities/:communityId/manage-access",
      initialEntries: [
        `/en/admin/communities/${communitiesData[0].id}/manage-access`,
      ],
    },
    apiResponses: {
      CommunityMembersCommunity: {
        data: {
          community: communityData,
        },
      },
      CommunityMembersTeam: {
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
