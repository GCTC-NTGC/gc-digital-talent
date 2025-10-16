import { StoryFn } from "@storybook/react";

import { makeFragmentData } from "@gc-digital-talent/graphql";

import UnlockEmployeeToolsDialog, {
  UnlockEmployeeTools_Query,
} from "./UnlockEmployeeToolsDialog";

export default {
  component: UnlockEmployeeToolsDialog,
};

const Template: StoryFn<typeof UnlockEmployeeToolsDialog> = (args) => {
  return <UnlockEmployeeToolsDialog {...args} defaultOpen />;
};

export const NothingVerified = Template.bind({});
NothingVerified.args = {
  query: makeFragmentData(
    {
      isWorkEmailVerified: false,
      workExperiences: [],
    },
    UnlockEmployeeTools_Query,
  ),
};

export const FullyVerified = Template.bind({});
FullyVerified.args = {
  query: makeFragmentData(
    {
      isWorkEmailVerified: true,
      workExperiences: [],
    },
    UnlockEmployeeTools_Query,
  ),
};
