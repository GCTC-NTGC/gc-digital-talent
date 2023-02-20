import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import fakeTeams from "@common/fakeData/fakeTeams";

import { TeamTable } from "./TeamTable";

const mockTeams = fakeTeams();

export default {
  component: TeamTable,
  title: "Tables/Team Table",
} as ComponentMeta<typeof TeamTable>;

const Template: ComponentStory<typeof TeamTable> = (args) => {
  const { teams } = args;
  return <TeamTable teams={teams} />;
};

export const Default = Template.bind({});
Default.args = {
  teams: mockTeams,
};
