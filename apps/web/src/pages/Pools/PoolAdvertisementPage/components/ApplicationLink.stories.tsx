import React from "react";
import { StoryFn, Meta } from "@storybook/react";

import ApplicationLink from "./ApplicationLink";

export default {
  component: ApplicationLink,
  title: "Pages/Pool Advertisement Poster/Components/ApplicationLink",
} as Meta<typeof ApplicationLink>;

const Template: StoryFn<typeof ApplicationLink> = (args) => {
  return <ApplicationLink {...args} />;
};

export const CannotApplyPoolClosed = Template.bind({});
CannotApplyPoolClosed.args = {
  poolId: "00000000-0000-0000-0000-000000000000",
  canApply: false,
};

export const CanApplyNoExistingApplication = Template.bind({});
CanApplyNoExistingApplication.args = {
  poolId: "00000000-0000-0000-0000-000000000000",
  canApply: true,
};

export const CanApplyDraftApplication = Template.bind({});
CanApplyDraftApplication.args = {
  poolId: "00000000-0000-0000-0000-000000000000",
  applicationId: "00000000-0000-0000-0000-000000000000",
  canApply: true,
};

export const CanApplySubmittedApplication = Template.bind({});
CanApplySubmittedApplication.args = {
  poolId: "00000000-0000-0000-0000-000000000000",
  applicationId: "00000000-0000-0000-0000-000000000000",
  hasApplied: true,
};
