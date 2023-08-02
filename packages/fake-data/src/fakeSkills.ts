import { faker } from "@faker-js/faker";

import { Skill, SkillFamily } from "@gc-digital-talent/graphql";

import staticSkills from "./skills.json";

const generateSkill = (skillFamilies: SkillFamily[]) => {
  const name = faker.lorem.word();
  const keywords = faker.lorem.words(3).split(" ");
  const keywordsEN = keywords.map((skill) => `${skill} EN`);
  const keywordsFR = keywords.map((skill) => `${skill} FR`);
  return {
    id: faker.string.uuid(),
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
): Skill[] => {
  faker.seed(0); // repeatable results

  return [...Array(numToGenerate)].map(() => generateSkill(skillFamilies));
};
