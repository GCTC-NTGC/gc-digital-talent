import { faker } from "@faker-js/faker";
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
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";

const generatePoolCandidate = (
  pools: Pool[],
  users: User[],
  classifications: Classification[],
): PoolCandidate => {
  faker.setLocale("en");
  return {
    id: faker.datatype.uuid(),
    pool: faker.helpers.arrayElement(pools),
    expectedClassifications:
      faker.helpers.arrayElements<Classification>(classifications),
    user: faker.helpers.arrayElement<User>(users) as Applicant,
    cmoIdentifier: faker.helpers.slugify(
      faker.lorem.words(faker.datatype.number({ min: 1, max: 3 })),
    ),
    expiryDate: faker.date
      .between("2100-01-01", "2100-12-31")
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
  };
};

export default (): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();
  const classifications = fakeClassifications();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generatePoolCandidate(pools, users, classifications),
  );
};
