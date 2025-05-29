import { Meta, StoryFn } from "@storybook/react";

import { fakeSearchRequests } from "@gc-digital-talent/fake-data";

import SearchRequestTable from "./SearchRequestTable";

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
  component: SearchRequestTable,
  parameters: {
    apiResponses: {
      SearchRequestTable: {
        data: {
          poolCandidateSearchRequestsPaginated: {
            data: requestsData,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
} as Meta<typeof SearchRequestTable>;

const Template: StoryFn<typeof SearchRequestTable> = (args) => {
  const { title } = args;

  return <SearchRequestTable title={title} />;
};

export const Default = {
  render: Template,

  args: {
    title: "Search Requests",
  },
};
