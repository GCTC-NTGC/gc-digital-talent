import { faker } from "@faker-js/faker/locale/en";
import type { StoryFn, Meta } from "@storybook/react-vite";

import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { GLOBAL_A11Y_EXCLUDES } from "@gc-digital-talent/storybook-helpers";
import type { PoolCandidateAdminViewWithSkillCount } from "@gc-digital-talent/graphql";

import PoolCandidatesTable from "./PoolCandidatesTable";

const poolCandidateData = fakePoolCandidates();

const mockPoolCandidatesWithSkillCount: PoolCandidateAdminViewWithSkillCount[] =
  poolCandidateData.map((poolCandidate) => {
    const skillCount = faker.number.int({
      min: 0,
      max: 10,
    });
    return {
      id: faker.string.uuid(),
      poolCandidate: {
        id: poolCandidate.id,
        pool: poolCandidate.pool,
        user: poolCandidate.user,

        status: poolCandidate.applicationStatusData?.status,
        screeningStage: poolCandidate.applicationStatusData?.screeningStage,
        statusUpdatedAt: poolCandidate.applicationStatusData?.statusUpdatedAt,

        isFlagged: poolCandidate.applicationAssessmentData?.isFlagged,
      },
      skillCount: skillCount || null,
    };
  });

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
    a11y: {
      context: {
        exclude: [
          ...GLOBAL_A11Y_EXCLUDES,
          // No colour contrast errors here
          "td > span > span > span",
        ],
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
