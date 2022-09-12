import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { fakePoolCandidates } from "@common/fakeData";
import { MyApplications } from "./MyApplicationsPage";

type Story = ComponentStory<typeof MyApplications>;
type Meta = ComponentMeta<typeof MyApplications>;

const mockApplications = fakePoolCandidates(50);

export default {
  component: MyApplications,
  title: "Direct Intake/My Applications",
  args: {
    applications: mockApplications,
  },
} as Meta;

const Template: Story = (args) => {
  return <MyApplications {...args} />;
};

export const BasicMyApplications = Template.bind({});
