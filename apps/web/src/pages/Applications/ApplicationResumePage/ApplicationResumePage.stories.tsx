import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import { ApplicationResume } from "./ApplicationResumePage";
import { ApplicationPageProps } from "../ApplicationApi";

const fakePoolCandidate = fakePoolCandidates(1)[0];

const defaultProps: ApplicationPageProps = {
  application: fakePoolCandidate,
};

export default {
  component: ApplicationResume,
  title: "Pages/Application Revamp/Review Resume",
} as ComponentMeta<typeof ApplicationResume>;

const Template: ComponentStory<typeof ApplicationResume> = (props) => (
  <ApplicationResume {...props} />
);

export const Default = Template.bind({});
Default.args = defaultProps;
