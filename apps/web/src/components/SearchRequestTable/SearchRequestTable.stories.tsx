import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import fakeSearchRequests from "@common/fakeData/fakeSearchRequests";

import { SearchRequestTable } from "./SearchRequestTable";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: SearchRequestTable,
  title: "Tables/Search Request Table",
} as ComponentMeta<typeof SearchRequestTable>;

const Template: ComponentStory<typeof SearchRequestTable> = (args) => {
  const { poolCandidateSearchRequests } = args;
  return (
    <SearchRequestTable
      poolCandidateSearchRequests={poolCandidateSearchRequests}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  poolCandidateSearchRequests: mockSearchRequests,
};
