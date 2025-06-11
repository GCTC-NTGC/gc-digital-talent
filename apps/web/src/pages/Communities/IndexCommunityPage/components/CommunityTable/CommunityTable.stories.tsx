import { Meta, StoryFn } from "@storybook/react-vite";

import { fakeCommunities } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import {
  CommunityTable,
  CommunityTable_CommunityFragment,
} from "./CommunityTable";
import { MyRoleTeam } from "./types";

const mockCommunities = fakeCommunities();

const mockCommunityFragments = mockCommunities.map((mockCommunity) =>
  makeFragmentData(mockCommunity, CommunityTable_CommunityFragment),
);

const mockRolesAndTeams: MyRoleTeam[] = [
  {
    communityId: mockCommunities[0].id,
    roleName: {
      en: "Role 1 EN",
      fr: "Role 1 FR",
    },
  },
  {
    communityId: mockCommunities[0].id,
    roleName: {
      en: "Role 2 EN",
      fr: "Role 2 FR",
    },
  },
];

export default {
  component: CommunityTable,
} as Meta<typeof CommunityTable>;

const Template: StoryFn<typeof CommunityTable> = (args) => {
  const { communitiesQuery, myRolesAndTeams, title } = args;
  return (
    <CommunityTable
      communitiesQuery={communitiesQuery}
      myRolesAndTeams={myRolesAndTeams}
      title={title}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  communitiesQuery: mockCommunityFragments,
  myRolesAndTeams: mockRolesAndTeams,
  title: "Communities",
};
