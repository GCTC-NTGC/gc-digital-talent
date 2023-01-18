import { faker } from "@faker-js/faker";
import {
  Classification,
  PoolCandidateFilter,
  OperationalRequirement,
  Pool,
  WorkRegion,
  LanguageAbility,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakePools from "./fakePools";

const generatePoolCandidateFilters = (
  classifications: Classification[],
  operationalRequirements: OperationalRequirement[],
  pools: Pool[],
): PoolCandidateFilter => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    pools: faker.helpers.arrayElements(pools),
    classifications: faker.helpers.arrayElements(classifications),
    equity: {
      isIndigenous: faker.datatype.boolean(),
      isVisibleMinority: faker.datatype.boolean(),
      isWoman: faker.datatype.boolean(),
      hasDisability: faker.datatype.boolean(),
    },
    hasDiploma: faker.datatype.boolean(),
    languageAbility: faker.helpers.arrayElement<LanguageAbility>(
      Object.values(LanguageAbility),
    ),
    workRegions: faker.helpers.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    operationalRequirements:
      faker.helpers.arrayElements<OperationalRequirement>(
        operationalRequirements,
      ),
  };
};

export default (): PoolCandidateFilter[] => {
  const classifications = fakeClassifications();
  const operationalRequirements =
    faker.helpers.arrayElements<OperationalRequirement>(
      Object.values(OperationalRequirement),
    );
  const pools = fakePools();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generatePoolCandidateFilters(
      classifications,
      operationalRequirements,
      pools,
    ),
  );
};
