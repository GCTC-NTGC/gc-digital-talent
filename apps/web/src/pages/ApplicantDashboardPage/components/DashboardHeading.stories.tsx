import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import { DashboardHeading } from "./DashboardHeading";

type Story = ComponentStory<typeof DashboardHeading>;
type Meta = ComponentMeta<typeof DashboardHeading>;

const mockUser = fakeUsers(1)[0];

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

export const CompleteProfile = Template.bind({});
