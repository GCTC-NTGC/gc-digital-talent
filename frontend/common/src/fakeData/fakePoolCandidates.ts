import faker from "faker";
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
import fakeOperationalRequirements from "./fakeOperationalRequirements";
import fakePools from "./fakePools";
import fakeUsers from "./fakeUsers";

const generatePoolCandidate = (
  pools: Pool[],
  users: User[],
  classifications: Classification[],
  operationalRequirements: OperationalRequirement[],
): PoolCandidate => {
  faker.setLocale("en");
  return {
    id: faker.datatype.uuid(),
    pool: faker.random.arrayElement(pools),
    expectedClassifications: faker.random.arrayElements(classifications),
    user: faker.random.arrayElement(users) as Applicant,
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
    languageAbility: faker.random.arrayElement(Object.values(LanguageAbility)),
    locationPreferences: faker.random.arrayElements(Object.values(WorkRegion)),
    acceptedOperationalRequirements: faker.random.arrayElements(
      operationalRequirements,
    ),
    expectedSalary: faker.random.arrayElements(Object.values(SalaryRange)),
    status: faker.random.arrayElement(Object.values(PoolCandidateStatus)),
  };
};

export default (): PoolCandidate[] => {
  const pools = fakePools();
  const users = fakeUsers();
  const classifications = fakeClassifications();
  const operationalRequirements = fakeOperationalRequirements();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generatePoolCandidate(
      pools,
      users,
      classifications,
      operationalRequirements,
    ),
  );
};
