import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeTeams } from "@gc-digital-talent/fake-data";

import ViewTeam, { ViewTeamPageFragment } from "./ViewTeam";

const mockTeams = fakeTeams();
const mockTeam = mockTeams[0];

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
  teamQuery: mockTeam as ViewTeamPageFragment,
};
