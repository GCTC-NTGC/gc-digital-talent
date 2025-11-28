import { faker } from "@faker-js/faker/locale/en";
import { StoryFn, Meta } from "@storybook/react-vite";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";

import PoolCandidatesTable from "./PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const mockPoolCandidatesWithSkillCount = poolCandidateData.map(
  (poolCandidate) => {
    const skillCount = faker.number.int({
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
  component: PoolCandidatesTable,
  parameters: {
    apiResponses: {
      CandidatesTableCandidatesPaginated_Query: {
        data: {
          poolCandidatesPaginatedAdminView: {
            data: mockPoolCandidatesWithSkillCount,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
    },
  },
  // NOTE: Inconclusive errors don't seem to be true errors
  //   - aria-required child on role=rowgroup does have role=row as child
  //   - invalid aria on dialog triggers which only contain valid aria
  //   - Colour contrast issues with headers where it clearly meets the minimum
  //   - th has data cell, it does
  tags: ["skip-a11y"],
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
