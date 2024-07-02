import { faker } from "@faker-js/faker/locale/en";

import {
  Classification,
  ApplicantFilter,
  OperationalRequirement,
  Pool,
  WorkRegion,
  LanguageAbility,
  PositionDuration,
  Skill,
  PoolStream,
} from "@gc-digital-talent/graphql";

import fakeSkills from "./fakeSkills";
import fakeClassifications from "./fakeClassifications";
import fakePools from "./fakePools";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateApplicantFilters = (
  classifications: Classification[],
  operationalRequirements: OperationalRequirement[],
  pools: Pool[],
  skills: Skill[],
): ApplicantFilter => {
  return {
    __typename: "ApplicantFilter",
    id: faker.string.uuid(),
    pools: faker.helpers.arrayElements(pools),
    equity: {
      isIndigenous: faker.datatype.boolean(),
      isVisibleMinority: faker.datatype.boolean(),
      isWoman: faker.datatype.boolean(),
      hasDisability: faker.datatype.boolean(),
    },
    hasDiploma: faker.datatype.boolean(),
    languageAbility: toLocalizedEnum(
      faker.helpers.arrayElement<LanguageAbility>(
        Object.values(LanguageAbility),
      ),
    ),

    locationPreferences: faker.helpers
      .arrayElements<WorkRegion>(Object.values(WorkRegion))
      .map((req) => toLocalizedEnum(req)),
    operationalRequirements: faker.helpers
      .arrayElements<OperationalRequirement>(operationalRequirements)
      .map((req) => toLocalizedEnum(req)),
    positionDuration: faker.helpers.arrayElements<PositionDuration>(
      Object.values(PositionDuration),
    ),
    skills,
    qualifiedStreams: faker.helpers
      .arrayElements<PoolStream>(Object.values(PoolStream), 1)
      .map((stream) => toLocalizedEnum(stream)),
  };
};

export default (): ApplicantFilter[] => {
  const classifications = fakeClassifications();
  const operationalRequirements =
    faker.helpers.arrayElements<OperationalRequirement>(
      Object.values(OperationalRequirement),
    );
  const pools = fakePools();
  const skills = fakeSkills(5);

  faker.seed(0); // repeatable results
  return [...Array(20)].map(() =>
    generateApplicantFilters(
      classifications,
      operationalRequirements,
      pools,
      skills,
    ),
  );
};
