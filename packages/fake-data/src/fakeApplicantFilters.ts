import { faker } from "@faker-js/faker/locale/en";

import {
  ApplicantFilter,
  OperationalRequirement,
  Pool,
  WorkRegion,
  LanguageAbility,
  PositionDuration,
  Skill,
  WorkStream,
} from "@gc-digital-talent/graphql";

import fakeSkills from "./fakeSkills";
import fakePools from "./fakePools";
import fakeWorkStreams from "./fakeWorkStreams";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateApplicantFilters = (
  operationalRequirements: OperationalRequirement[],
  pools: Pool[],
  skills: Skill[],
  workStreams: WorkStream[],
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
    workStreams: faker.helpers.arrayElements<WorkStream>(workStreams, 1),
  };
};

export default (): ApplicantFilter[] => {
  const operationalRequirements =
    faker.helpers.arrayElements<OperationalRequirement>(
      Object.values(OperationalRequirement),
    );
  const pools = fakePools();
  const skills = fakeSkills(5);
  const workStreams = fakeWorkStreams();

  faker.seed(0); // repeatable results
  return Array.from({ length: 20 }, () =>
    generateApplicantFilters(
      operationalRequirements,
      pools,
      skills,
      workStreams,
    ),
  );
};
