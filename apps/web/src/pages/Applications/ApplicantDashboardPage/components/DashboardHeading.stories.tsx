import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { experienceGenerators, fakeUsers } from "@gc-digital-talent/fake-data";

import DashboardHeading from "./DashboardHeading";

type Story = ComponentStory<typeof DashboardHeading>;
type Meta = ComponentMeta<typeof DashboardHeading>;

const mockUser = fakeUsers(1)[0];
mockUser.workExperiences = experienceGenerators.workExperiences(3);
mockUser.awardExperiences = experienceGenerators.awardExperiences(1);

export default {
  component: DashboardHeading,
  title: "Pages/Applicant Dashboard/Dashboard Heading",
  args: {
    user: mockUser,
  },
} as Meta;

const Template: Story = (args) => {
  return <DashboardHeading {...args} />;
};

export const PartiallyCompletedProfile = Template.bind({});
