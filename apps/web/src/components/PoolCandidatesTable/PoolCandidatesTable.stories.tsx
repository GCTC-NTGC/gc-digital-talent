import React from "react";
import { faker } from "@faker-js/faker";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import PoolCandidatesTable from "./PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const mockPoolCandidatesWithSkillCount = poolCandidateData.map(
  (poolCandidate) => {
    const skillCount = faker.datatype.number({
      min: 0,
      max: 10,
    });
    return {
      id: poolCandidate.id,
      poolCandidate,
      skillCount: skillCount || null,
    };
  },
);

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
    themeKey: "admin",
    apiResponses: {
      GetPoolCandidatesPaginated: {
        data: {
          poolCandidatesPaginated: {
            data: mockPoolCandidatesWithSkillCount,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
} as ComponentMeta<typeof PoolCandidatesTable>;

const Template: ComponentStory<typeof PoolCandidatesTable> = (args) => {
  const { initialFilterInput } = args;

  return (
    <PoolCandidatesTable
      initialFilterInput={initialFilterInput}
      title="Pool Candidates"
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Pool Candidates",
  initialFilterInput: { applicantFilter: { pools: [{ id: "123" }] } },
};
