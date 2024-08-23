import { faker } from "@faker-js/faker/locale/en";
import { UniqueEnforcer } from "enforce-unique";

import { SkillFamily, Skill } from "@gc-digital-talent/graphql";

import staticSkillFamilies from "./skillFamilies.json";

export const getStaticSkillFamilies = (): SkillFamily[] =>
  staticSkillFamilies.data.skillFamilies as SkillFamily[];

const generateSkillFamily = (
  skills: Skill[],
  uniqueEnforcerId: UniqueEnforcer,
) => {
  const name = faker.lorem.word();
  const uniqueId = uniqueEnforcerId.enforce(() => {
    return faker.string.uuid();
  });
  return {
    __typename: undefined,
    description: {
      en: `EN ${faker.lorem.sentences()}`,
      fr: `FR ${faker.lorem.sentences()}`,
    },
    id: uniqueId,
    key: faker.helpers.slugify(name),
    name: {
      en: `EN ${name}`,
      fr: `FR ${name}`,
    },
    skills: skills.length
      ? faker.helpers.arrayElements<Skill>(skills)
      : ([] as Skill[]),
  };
};

export default (numToGenerate = 15, skills: Skill[] = []): SkillFamily[] => {
  faker.seed(0); // repeatable results
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return [...Array<number>(numToGenerate)].map(() =>
    generateSkillFamily(skills, uniqueEnforcerId),
  );
};
