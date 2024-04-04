import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeTeams } from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import ViewTeam, { ViewTeamPage_TeamFragment } from "./ViewTeam";

const mockTeams = fakeTeams();
const mockTeam = mockTeams[0];
const mockTeamFragment = makeFragmentData(mockTeam, ViewTeamPage_TeamFragment);

export default {
  component: ViewTeam,
  title: "Components/View Team",
} as Meta<typeof ViewTeam>;

const Template: StoryFn<typeof ViewTeam> = (args) => {
  const { teamQuery } = args;
  return <ViewTeam teamQuery={teamQuery} />;
};

export const Default = Template.bind({});
Default.args = {
  teamQuery: mockTeamFragment,
};
