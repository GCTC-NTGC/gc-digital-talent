import { faker } from "@faker-js/faker";
import { FAR_FUTURE_DATE, FAR_PAST_DATE } from "../helpers/dateUtils";
import {
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  PoolCandidateStatus,
  PoolCandidate,
  Classification,
  OperationalRequirement,
  Pool,
  User,
  Applicant,
  PoolAdvertisement,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";
import fakePoolAdvertisements from "./fakePoolAdvertisements";

const generatePoolCandidate = (
  pools: Pool[],
  poolAdvertisements: PoolAdvertisement[],
  users: User[],
  classifications: Classification[],
): PoolCandidate => {
  faker.setLocale("en");
  return {
    id: faker.datatype.uuid(),
    pool: faker.helpers.arrayElement(pools),
    poolAdvertisement: faker.helpers.arrayElement(poolAdvertisements),
    expectedClassifications:
      faker.helpers.arrayElements<Classification>(classifications),
    user: faker.helpers.arrayElement<User>(users) as Applicant,
    cmoIdentifier: faker.helpers.slugify(
      faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
    ),
    expiryDate: faker.date
      .between("2022-01-01", "2100-12-31")
      .toISOString()
      .substring(0, 10),
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isIndigenous: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    hasDiploma: faker.datatype.boolean(),
    languageAbility: faker.helpers.arrayElement<LanguageAbility>(
      Object.values(LanguageAbility),
    ),
    locationPreferences: faker.helpers.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    acceptedOperationalRequirements:
      faker.helpers.arrayElements<OperationalRequirement>(
        Object.values(OperationalRequirement),
      ),
    expectedSalary: faker.helpers.arrayElements<SalaryRange>(
      Object.values(SalaryRange),
    ),
    status: faker.helpers.arrayElement<PoolCandidateStatus>(
      Object.values(PoolCandidateStatus),
    ),
    archivedAt: faker.helpers.maybe(() =>
      faker.date.past().toISOString().substring(0, 10),
    ),
    submittedAt: faker.date
      .between(FAR_PAST_DATE, FAR_FUTURE_DATE)
      .toISOString()
      .substring(0, 10),
  };
};

export default (amount?: number): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();
  const classifications = fakeClassifications();
  const poolAdvertisements = fakePoolAdvertisements();

  faker.seed(0); // repeatable results
  return [...Array(amount || 20)].map(() =>
    generatePoolCandidate(pools, poolAdvertisements, users, classifications),
  );
};
