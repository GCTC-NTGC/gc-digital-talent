import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import { SearchRequestTableClient } from "./SearchRequestTableClient";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: SearchRequestTableClient,
  title: "Tables/Search Request Table Client",
  parameters: {
    themeKey: "admin",
  },
} as Meta<typeof SearchRequestTableClient>;

const Template: StoryFn<typeof SearchRequestTableClient> = (args) => {
  const { poolCandidateSearchRequests, title } = args;
  return (
    <SearchRequestTableClient
      poolCandidateSearchRequests={poolCandidateSearchRequests}
      title={title}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  poolCandidateSearchRequests: mockSearchRequests,
  title: "Requests",
};
