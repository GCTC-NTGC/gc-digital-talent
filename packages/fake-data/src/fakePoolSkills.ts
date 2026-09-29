import { faker } from "@faker-js/faker/locale/en";

import type { PoolSkill, Skill } from "@gc-digital-talent/graphql/schema-types";
import {
  PoolSkillType,
  SkillLevel,
} from "@gc-digital-talent/graphql/schema-types";

import fakeSkills from "./fakeSkills";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generatePoolSkill = (): PoolSkill => {
  return {
    __typename: "PoolSkill",
    id: faker.string.uuid(),
    type: toLocalizedEnum(
      faker.helpers.arrayElement<PoolSkillType>(Object.values(PoolSkillType)),
      "LocalizedPoolSkillType",
    ),
    requiredLevel: faker.helpers.arrayElement<SkillLevel>(
      Object.values(SkillLevel),
    ),
    skill: faker.helpers.arrayElement<Skill>(fakeSkills(1)),
  };
};

export default (numToGenerate?: number): PoolSkill[] => {
  faker.seed(0); // repeatable results
  return Array.from({ length: numToGenerate ?? 20 }, () => generatePoolSkill());
};
