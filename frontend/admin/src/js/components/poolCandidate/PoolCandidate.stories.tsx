import React from "react";
import { Meta, Story } from "@storybook/react";
import { fakePoolCandidates } from "@common/fakeData";
import PoolCandidatesTable from "./PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const mockPaginatorInfo = {
  count: 1,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: true,
  lastItem: 1,
  lastPage: 1,
  perPage: 5,
  total: 100,
};

export default {
  component: PoolCandidatesTable,
  title: "Pool Candidates",
  args: { poolId: "123" },
} as Meta;

const PoolCandidatesTableTemplate: Story = () => {
  return <PoolCandidatesTable poolId="123" />;
};

export const PoolCandidatesTableStory = PoolCandidatesTableTemplate.bind({});
PoolCandidatesTableStory.storyName = "Pool Candidates Table";
PoolCandidatesTableStory.parameters = {
  apiResponses: {
    GetPoolCandidatesPaginated: {
      data: {
        poolCandidatesPaginated: {
          data: [...poolCandidateData.slice(0, 4)],
          paginatorInfo: mockPaginatorInfo,
        },
      },
    },
  },
};
