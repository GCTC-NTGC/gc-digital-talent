import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeTeams } from "@gc-digital-talent/fake-data";

import ViewTeam from "./ViewTeam";

const mockTeams = fakeTeams();
const mockTeam = mockTeams[0];

export default {
  component: ViewTeam,
  title: "Components/View Team",
} as ComponentMeta<typeof ViewTeam>;

const Template: ComponentStory<typeof ViewTeam> = (args) => {
  const { team } = args;
  return <ViewTeam team={team} />;
};

export const Default = Template.bind({});
Default.args = {
  team: mockTeam,
};
