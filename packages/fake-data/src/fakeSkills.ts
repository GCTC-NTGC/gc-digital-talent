import { faker } from "@faker-js/faker/locale/en";
import { UniqueEnforcer } from "enforce-unique";

import type { SkillFamily } from "@gc-digital-talent/graphql/schema-types";
import { SkillCategory } from "@gc-digital-talent/graphql/schema-types";

import toLocalizedString from "./fakeLocalizedString";
import staticSkills from "./skills.json" with { type: "json" };
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
    __typename: "Skill" as const,
    id: uniqueId,
    key: faker.helpers.slugify(name),
    name: toLocalizedString(name),
    description: toLocalizedString(
      `skill description ${faker.lorem.sentences()}`,
    ),
    keywords: {
      __typename: "SkillKeywords" as const,
      en: keywordsEN,
      fr: keywordsFR,
    },
    category: toLocalizedEnum(
      overrideCategory ??
        faker.helpers.arrayElement<SkillCategory>(Object.values(SkillCategory)),
      "LocalizedSkillCategory",
    ),
    families: skillFamilies.length
      ? faker.helpers.arrayElements<SkillFamily>(skillFamilies)
      : ([] as SkillFamily[]),
    experienceSkills: [],
    experienceSkillRecord: {
      __typename: "ExperienceSkillRecord" as const,
      details: `experienceSkillDetails ${faker.lorem.words()}`,
    },
    experiences: [],
  };
};

const skillCategories: Record<string, SkillCategory> = {
  [SkillCategory.Behavioural]: SkillCategory.Behavioural,
  [SkillCategory.Technical]: SkillCategory.Technical,
};

const toSkillCategory = (value: string) =>
  skillCategories[value] ?? SkillCategory.Technical;

export const getStaticSkills = () =>
  staticSkills.data.skills.map((skill) => ({
    __typename: "Skill" as const,
    id: skill.id,
    key: skill.key,
    name: toLocalizedString(skill.name),
    description: toLocalizedString(skill.description),
    keywords: { __typename: "SkillKeywords" as const, ...skill.keywords },
    category: toLocalizedEnum(
      toSkillCategory(skill.category.value),
      "LocalizedSkillCategory",
    ),
    families: skill.families.map((family) => ({
      __typename: "SkillFamily" as const,
      id: family.id,
      key: family.key,
      name: toLocalizedString(family.name),
      description: toLocalizedString(family.description),
    })),
  }));

export default (
  numToGenerate = 10,
  skillFamilies: SkillFamily[] = [],
  overrideCategory = SkillCategory.Technical,
) => {
  faker.seed(0); // repeatable results
  const uniqueEnforcerId = new UniqueEnforcer(); // Ensure unique IDs

  return Array.from({ length: numToGenerate }, () =>
    generateSkill(skillFamilies, uniqueEnforcerId, overrideCategory),
  );
};
