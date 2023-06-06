import React from "react";

import { Meta, StoryFn } from "@storybook/react";
import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import SearchRequestsTable from "./SearchRequestsTableApi";

const requestsData = fakeSearchRequests();
const mockPaginatorInfo = {
  count: 20,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: false,
  lastItem: 20,
  lastPage: 1,
  perPage: 20,
  total: 20,
};

export default {
  title: "Tables/Search Requests Table Api",
  component: SearchRequestsTable,
  parameters: {
    themeKey: "admin",
    apiResponses: {
      getPoolCandidateSearchRequestsPaginated: {
        data: {
          poolCandidateSearchRequestsPaginated: {
            data: requestsData,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
} as Meta<typeof SearchRequestsTable>;

const Template: StoryFn<typeof SearchRequestsTable> = (args) => {
  const { initialFilterInput, title } = args;

  return (
    <SearchRequestsTable
      initialFilterInput={initialFilterInput}
      title={title}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  initialFilterInput: undefined,
  title: "Search Requests",
};
