import { faker } from "@faker-js/faker";
import {
  Classification,
  CmoAsset,
  PoolCandidateFilter,
  OperationalRequirement,
  Pool,
  WorkRegion,
  LanguageAbility,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";
import fakeCmoAssets from "./fakeCmoAssets";
import fakePools from "./fakePools";

const generatePoolCandidateFilters = (
  classifications: Classification[],
  cmoAssets: CmoAsset[],
  operationalRequirements: OperationalRequirement[],
  pools: Pool[],
): PoolCandidateFilter => {
  faker.setLocale("en");

  return {
    id: faker.datatype.uuid(),
    pools: faker.random.arrayElements(pools),
    classifications: faker.random.arrayElements(classifications),
    isWoman: faker.datatype.boolean(),
    hasDisability: faker.datatype.boolean(),
    isIndigenous: faker.datatype.boolean(),
    isVisibleMinority: faker.datatype.boolean(),
    hasDiploma: faker.datatype.boolean(),
    languageAbility: faker.random.arrayElement<LanguageAbility>(
      Object.values(LanguageAbility),
    ),
    workRegions: faker.random.arrayElements<WorkRegion>(
      Object.values(WorkRegion),
    ),
    operationalRequirements: faker.random.arrayElements<OperationalRequirement>(
      operationalRequirements,
    ),
    cmoAssets: faker.random.arrayElements(cmoAssets),
  };
};

export default (): PoolCandidateFilter[] => {
  const classifications = fakeClassifications();
  const cmoAssets = fakeCmoAssets();
  const operationalRequirements =
    faker.random.arrayElements<OperationalRequirement>(
      Object.values(OperationalRequirement),
    );
  const pools = fakePools();

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generatePoolCandidateFilters(
      classifications,
      cmoAssets,
      operationalRequirements,
      pools,
    ),
  );
};
