import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import { SearchRequestTable } from "./SearchRequestTable";

const mockSearchRequests = fakeSearchRequests();

export default {
  component: SearchRequestTable,
  title: "Tables/Search Request Table",
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof SearchRequestTable>;

const Template: ComponentStory<typeof SearchRequestTable> = (args) => {
  const { poolCandidateSearchRequests, title } = args;
  return (
    <SearchRequestTable
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
