import faker from "faker";
import { fakeOperationalRequirements, fakeUsers } from ".";
import {
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  PoolCandidateStatus,
  PoolCandidate,
  Classification,
  OperationalRequirement,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakePools from "./fakePools";

const generateFake = (
  classifications: Classification[],
  operationalRequirements: OperationalRequirement[],
): PoolCandidate => {
  const fake: PoolCandidate = {
    id: faker.datatype.uuid(),
    pool: faker.random.arrayElement(fakePools()),
    expectedClassifications: faker.random.arrayElements(classifications),
    user: faker.random.arrayElement(fakeUsers()),
    cmoIdentifier: faker.helpers.slugify(
      faker.lorem.words(faker.datatype.number(3) + 1),
    ),
    expiryDate: faker.date.future().toISOString().substring(0, 10),
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
  return fake;
};

export default (): PoolCandidate[] => {
  faker.seed(0); // repeatable results

  const classifications = fakeClassifications();
  const operationalRequirements = fakeOperationalRequirements();

  return [...Array(10)].map(() =>
    generateFake(classifications, operationalRequirements),
  );
};
