import { faker } from "@faker-js/faker";
import { Skill, SkillFamily } from "../api/generated";
import staticSkills from "./skills.json";

const generateSkill = (skillFamilies: SkillFamily[]) => {
  const name = faker.random.word();
  const keywords = faker.lorem.words(3).split(" ");
  const keywordsEN = keywords.map((skill) => `${skill} EN`);
  const keywordsFR = keywords.map((skill) => `${skill} FR`);
  return {
    id: faker.datatype.uuid(),
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
  };
};

export const getStaticSkills = (): Skill[] =>
  staticSkills.data.skills as Skill[];

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
): Skill[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() => generateSkill(skillFamilies));
};
