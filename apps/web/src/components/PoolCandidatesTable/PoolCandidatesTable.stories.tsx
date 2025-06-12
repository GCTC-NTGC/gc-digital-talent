import { faker } from "@faker-js/faker/locale/en";
import { StoryFn, Meta } from "@storybook/react";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import PoolCandidatesTable from "./PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const mockPoolCandidatesWithSkillCount = poolCandidateData.map(
  (poolCandidate) => {
    const skillCount = faker.number.int({
      min: 0,
      max: 10,
    });
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    poolCandidate.viewNotes = { notes: poolCandidate.notes };
    poolCandidate.viewStatus = {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      status: poolCandidate.status,
      placedDepartment: poolCandidate.placedDepartment,
    };
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
  component: PoolCandidatesTable,
  parameters: {
    apiResponses: {
      CandidatesTableCandidatesPaginated_Query: {
        data: {
          poolCandidatesPaginated: {
            data: mockPoolCandidatesWithSkillCount,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
} as Meta<typeof PoolCandidatesTable>;

const Template: StoryFn<typeof PoolCandidatesTable> = (args) => {
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
