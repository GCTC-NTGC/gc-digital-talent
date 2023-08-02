import { faker } from "@faker-js/faker";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import {
  PoolCandidateStatus,
  PoolCandidate,
  Pool,
  User,
} from "@gc-digital-talent/graphql";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";

const generatePoolCandidate = (pools: Pool[], users: User[]): PoolCandidate => {
  return {
    id: faker.string.uuid(),
    pool: faker.helpers.arrayElement(pools),
    user: faker.helpers.arrayElement<User>(users),
    cmoIdentifier: faker.helpers.slugify(
      faker.lorem.words(faker.number.int({ min: 1, max: 3 })),
    ),
    expiryDate: faker.date
      .between({ from: FAR_PAST_DATE, to: FAR_FUTURE_DATE })
      .toISOString()
      .substring(0, 10),
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
    ),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: FAR_PAST_DATE,
    suspendedAt: faker.helpers.arrayElement([null, new Date().toISOString()]),
  };
};

export default (amount?: number): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();

  faker.seed(0); // repeatable results
  return [...Array(amount || 20)].map(() =>
    generatePoolCandidate(pools, users),
  );
};
