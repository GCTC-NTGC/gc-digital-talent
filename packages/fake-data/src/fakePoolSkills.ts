import { faker } from "@faker-js/faker/locale/en";

import {
  PoolSkillType,
  SkillLevel,
} from "@gc-digital-talent/graphql/schema-types";

import fakeSkills from "./fakeSkills";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generatePoolSkill = () => {
  return {
    __typename: "PoolSkill" as const,
    id: faker.string.uuid(),
    type: toLocalizedEnum(
      faker.helpers.arrayElement<PoolSkillType>(Object.values(PoolSkillType)),
      "LocalizedPoolSkillType",
    ),
    requiredLevel: faker.helpers.arrayElement<SkillLevel>(
      Object.values(SkillLevel),
    ),
    skill: faker.helpers.arrayElement(fakeSkills(1)),
  };
};

export default (numToGenerate?: number) => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate ?? 20 }, () => generatePoolSkill());
};
