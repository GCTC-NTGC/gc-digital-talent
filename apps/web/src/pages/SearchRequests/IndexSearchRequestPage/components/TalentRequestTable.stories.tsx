import type { Meta, StoryFn } from "@storybook/react-vite";

import {
  fakeClassifications,
  fakeDepartments,
  fakeTalentRequests,
  fakeWorkStreams,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { TalentRequestStatus } from "@gc-digital-talent/graphql";

import TalentRequestTable from "./TalentRequestTable";

const requestsData = fakeTalentRequests();
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
  component: TalentRequestTable,
  parameters: {
    apiResponses: {
      TalentRequestTable: {
        data: {
          talentRequests: {
            data: requestsData,
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
      TalentRequestFilterData: {
        data: {
          classifications: fakeClassifications(),
          departments: fakeDepartments(),
          workStreams: fakeWorkStreams(),
          statuses: Object.values(TalentRequestStatus).map((status) => ({
            __typename: "LocalizedTalentRequestStatus" as const,
            ...toLocalizedEnum(status),
          })),
        },
      },
    },
  },
} as Meta<typeof TalentRequestTable>;

const Template: StoryFn<typeof TalentRequestTable> = (args) => {
  const { title } = args;

  return <TalentRequestTable title={title} />;
};

export const Default = Template.bind({});
Default.args = {
  title: "Talent Requests",
};
