import { faker } from "@faker-js/faker";
import { Skill, SkillFamily } from "../api/generated";

const generateSkill = (skillFamilies: SkillFamily[]) => {
  const name = faker.random.word();
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
    keywords: faker.lorem.words(3).split(" "),
    families: skillFamilies.length
      ? faker.helpers.arrayElements<SkillFamily>(skillFamilies)
      : ([] as SkillFamily[]),
    experienceSkills: [],
  };
};

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
): Skill[] => {
  faker.seed(0); // repeatable results
  faker.setLocale("en");

  return [...Array(numToGenerate)].map(() => generateSkill(skillFamilies));
};
