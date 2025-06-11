import { faker } from "@faker-js/faker";
import { StoryFn } from "@storybook/react-vite";

import {
  fakeDepartments,
  fakeLocalizedEnum,
  fakePools,
  fakeUser,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  PlacementType,
  PoolCandidate,
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { MockGraphqlDecorator } from "@gc-digital-talent/storybook-helpers";

import { JobPlacementOptions_Query } from "~/components/PoolCandidatesTable/JobPlacementDialog";

import UserInformationPage, {
  UserInfo_Fragment,
  UserInformation,
} from "./UserInformationPage";

faker.seed(0);

const mockUser = fakeUser();
const mockPools = fakePools(10);
const mockDepartments = fakeDepartments();

const poolCandidates: PoolCandidate[] = [
  {
    id: "candidate0",
    user: mockUser,
    pool: mockPools[0],
    notes: faker.lorem.sentence(),
    submittedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    isBookmarked: faker.datatype.boolean(0.2),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateStatus>(
        Object.values(PoolCandidateStatus),
      ),
    ),
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    finalDecisionAt: faker.helpers.arrayElement([
      null,
      new Date().toISOString(),
    ]),
    expiryDate: FAR_FUTURE_DATE,
  },
  {
    id: "candidate1",
    user: mockUser,
    pool: mockPools[1],
    notes: faker.lorem.sentence(),
    submittedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    isBookmarked: faker.datatype.boolean(0.2),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateStatus>(
        Object.values(PoolCandidateStatus),
      ),
    ),
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    finalDecisionAt: faker.helpers.arrayElement([
      null,
      new Date().toISOString(),
    ]),
    expiryDate: FAR_FUTURE_DATE,
  },
  {
    id: "candidate2",
    user: mockUser,
    pool: mockPools[2],
    notes: faker.lorem.sentence(),
    submittedAt: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    isBookmarked: faker.datatype.boolean(0.2),
    status: toLocalizedEnum(
      faker.helpers.arrayElement<PoolCandidateStatus>(
        Object.values(PoolCandidateStatus),
      ),
    ),
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
    finalDecisionAt: faker.helpers.arrayElement([
      null,
      new Date().toISOString(),
    ]),
    expiryDate: FAR_FUTURE_DATE,
  },
];

mockUser.poolCandidates = poolCandidates;
const typeAdjustedUser = { ...mockUser, experiences: undefined };

export default {
  component: UserInformationPage,
  decorators: [MockGraphqlDecorator],
  parameters: {
    apiResponses: {
      PoolFilter: {
        data: {
          poolsPaginated: {
            data: mockPools,
            paginatorInfo: {
              total: mockPools.length,
            },
          },
        },
      },
      AvailablePoolsToAddTo: {
        data: {
          poolsPaginated: { data: mockPools },
        },
      },
    },
  },
};

const Template: StoryFn<typeof UserInformationPage> = () => {
  return (
    <UserInformation
      userQuery={makeFragmentData(typeAdjustedUser, UserInfo_Fragment)}
      jobPlacementOptions={makeFragmentData(
        {
          departments: mockDepartments,
          placementTypes: fakeLocalizedEnum(PlacementType),
        },
        JobPlacementOptions_Query,
      )}
    />
  );
};

export const Default = Template.bind({});
