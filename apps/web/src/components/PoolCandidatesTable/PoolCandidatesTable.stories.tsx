import React from "react";
import { storiesOf } from "@storybook/react";

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

const stories = storiesOf("Pool Candidates", module);

stories.add(
  "Tables/Pool Candidates Table",
  () => (
    <PoolCandidatesTable
      initialFilterInput={{ applicantFilter: { pools: [{ id: "123" }] } }}
    />
  ),
  {
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
);
