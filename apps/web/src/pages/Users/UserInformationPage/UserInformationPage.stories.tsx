import { faker } from "@faker-js/faker";
import { StoryFn } from "@storybook/react";

import {
  fakeDepartments,
  fakePools,
  fakeUser,
} from "@gc-digital-talent/fake-data";
import {
  PoolCandidate,
  PoolCandidateStatus,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

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
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
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
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
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
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
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
};

const Template: StoryFn<typeof UserInformationPage> = () => {
  return (
    <UserInformation
      userQuery={makeFragmentData(typeAdjustedUser, UserInfo_Fragment)}
      pools={mockPools}
      departments={mockDepartments}
    />
  );
};

export const Default = Template.bind({});
