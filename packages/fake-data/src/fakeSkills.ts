import { faker } from "@faker-js/faker";
import { UniqueEnforcer } from "enforce-unique";

import { Skill, SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import staticSkills from "./skills.json";

const generateSkill = (
  skillFamilies: SkillFamily[],
  uniqueEnforcerId: UniqueEnforcer,
  overrideCategory: SkillCategory,
) => {
  const name = faker.lorem.word();
  const keywords = faker.lorem.words(3).split(" ");
  const keywordsEN = keywords.map((skill) => `${skill} EN`);
  const keywordsFR = keywords.map((skill) => `${skill} FR`);
  const uniqueId = uniqueEnforcerId.enforce(() => {
    return faker.string.uuid();
  });
  return {
    id: uniqueId,
    key: faker.helpers.slugify(faker.lorem.word()),
    name: {
      en: `EN ${faker.lorem.word()}`,
      fr: `FR ${faker.lorem.word()}`,
    },
    description: {
      en: `EN skill description ${faker.lorem.sentences()}`,
      fr: `FR skill description ${faker.lorem.sentences()}`,
    },
    keywords: {
      en: keywordsEN,
      fr: keywordsFR,
    },
    category:
      overrideCategory ??
      faker.helpers.arrayElement<SkillCategory>([
        SkillCategory.Behavioural,
        SkillCategory.Technical,
      ]),
    families: skillFamilies.length
      ? faker.helpers.arrayElements<SkillFamily>(skillFamilies)
      : ([] as SkillFamily[]),
    experienceSkills: [],
    experienceSkillRecord: {
      details: `experienceSkillDetails ${faker.lorem.words()}`,
    },
    experiences: [],
  };
};

export const getStaticSkills = (): Skill[] =>
  staticSkills.data.skills as Skill[];

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
  overrideCategory = SkillCategory.Technical,
): Skill[] => {
  faker.seed(0); // repeatable results
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return [...Array(numToGenerate)].map(() =>
    generateSkill(skillFamilies, uniqueEnforcerId, overrideCategory),
  );
};
