import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

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
  title: "Tables/Pool Candidates Table",
  component: PoolCandidatesTable,
  parameters: {
    apiResponses: {
      GetPoolCandidatesPaginated: {
        data: {
          poolCandidatesPaginated: {
            data: poolCandidateData,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
} as ComponentMeta<typeof PoolCandidatesTable>;

const Template: ComponentStory<typeof PoolCandidatesTable> = (args) => {
  const { initialFilterInput } = args;

  return <PoolCandidatesTable initialFilterInput={initialFilterInput} />;
};

export const Default = Template.bind({});
Default.args = {
  initialFilterInput: { applicantFilter: { pools: [{ id: "123" }] } },
};
