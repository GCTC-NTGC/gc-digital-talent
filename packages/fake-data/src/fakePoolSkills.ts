import { faker } from "@faker-js/faker";

import {
  PoolSkillType,
  PoolSkill,
  Skill,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import fakeSkills from "./fakeSkills";

const generatePoolSkill = (): PoolSkill => {
  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement<PoolSkillType>(
      Object.values(PoolSkillType),
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
  return [...Array(amountToGenerate)].map(() => generatePoolSkill());
};
