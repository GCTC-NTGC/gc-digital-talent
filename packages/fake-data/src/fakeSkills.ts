import { faker } from "@faker-js/faker/locale/en";
import { UniqueEnforcer } from "enforce-unique";

import { Skill, SkillCategory, SkillFamily } from "@gc-digital-talent/graphql";

import staticSkills from "./skills.json";
import toLocalizedEnum from "./fakeLocalizedEnum";

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
    key: faker.helpers.slugify(name),
    name: {
      en: `EN ${name}`,
      fr: `FR ${name}`,
    },
    description: {
      en: `EN skill description ${faker.lorem.sentences()}`,
      fr: `FR skill description ${faker.lorem.sentences()}`,
    },
    keywords: {
      en: keywordsEN,
      fr: keywordsFR,
    },
    category: toLocalizedEnum(
      overrideCategory ??
        faker.helpers.arrayElement<SkillCategory>(Object.values(SkillCategory)),
    ),
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
  staticSkills.data.skills.map((skill) => ({
    ...skill,
    // TO DO: Regenerate static data to no need this
    category: toLocalizedEnum(skill.category),
  })) as Skill[];

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
  overrideCategory = SkillCategory.Technical,
): Skill[] => {
  faker.seed(0); // repeatable results
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return [...Array<number>(numToGenerate)].map(() =>
    generateSkill(skillFamilies, uniqueEnforcerId, overrideCategory),
  );
};
