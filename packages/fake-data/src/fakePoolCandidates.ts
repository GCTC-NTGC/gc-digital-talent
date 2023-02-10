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
  Applicant,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";
import fakePoolAdvertisements from "./fakePoolAdvertisements";

const generatePoolCandidate = (
  pools: Pool[],
  poolAdvertisements: PoolAdvertisement[],
  users: User[],
): PoolCandidate => {
  faker.setLocale("en");
  return {
    id: faker.datatype.uuid(),
    pool: faker.helpers.arrayElement(pools),
    poolAdvertisement: faker.helpers.arrayElement(poolAdvertisements),
    user: faker.helpers.arrayElement<User>(users) as Applicant,
    cmoIdentifier: faker.helpers.slugify(
      faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
    ),
    expiryDate: faker.date
      .between(FAR_PAST_DATE, FAR_FUTURE_DATE)
      .toISOString()
      .substring(0, 10),
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
    ),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: FAR_PAST_DATE,
  };
};

export default (amount?: number): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();
  const poolAdvertisements = fakePoolAdvertisements();

  faker.seed(0); // repeatable results
  return [...Array(amount || 20)].map(() =>
    generatePoolCandidate(pools, poolAdvertisements, users),
  );
};
