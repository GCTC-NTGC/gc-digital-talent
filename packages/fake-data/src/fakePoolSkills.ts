import { faker } from "@faker-js/faker/locale/en";

import {
  PoolSkillType,
  PoolSkill,
  Skill,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import fakeSkills from "./fakeSkills";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generatePoolSkill = (): PoolSkill => {
  return {
    id: faker.string.uuid(),
    type: toLocalizedEnum(
      faker.helpers.arrayElement<PoolSkillType>(Object.values(PoolSkillType)),
    ),
    requiredLevel: faker.helpers.arrayElement<SkillLevel>(
      Object.values(SkillLevel),
    ),
    skill: faker.helpers.arrayElement<Skill>(fakeSkills(1)),
  };
};

export default (numToGenerate?: number): PoolSkill[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate || 20;
  return [...Array<number>(amountToGenerate)].map(() => generatePoolSkill());
};
