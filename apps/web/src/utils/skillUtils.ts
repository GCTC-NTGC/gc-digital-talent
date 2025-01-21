import flatMap from "lodash/flatMap";
import uniqBy from "lodash/uniqBy";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  SkillLevel,
  Experience,
  Maybe,
  Skill,
  SkillCategory,
  SkillFamily,
  PoolSkill,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

/**
 * Transforms an array of skills with child skill families into a tree of skill families with child skills.
 * @param { Skill[] } skills - The collection of skills with child skill families to invert
 * @returns { SkillFamily[] } - The new collection of skill families with child skills
 */
export function invertSkillSkillFamilyTree(skills: Skill[]): SkillFamily[] {
  const allChildSkillFamilies = flatMap(skills, (s) => s.families).filter(
    notEmpty,
  );
  const uniqueSkillFamilies = uniqBy(allChildSkillFamilies, "id");
  const skillFamiliesWithSkills = uniqueSkillFamilies.map(
    (family: SkillFamily) => {
      // step 1 - find the skills that belong to this family
      const skillsInThisFamily = skills.filter((skill) =>
        skill.families?.some(
          (childSkillFamilies) => family.id === childSkillFamilies?.id,
        ),
      );

      // step 2 - clone the skills and strip off the child skillFamilies to prevent circular references
      const skillWithChildrenRemoved = skillsInThisFamily.map((skill) => {
        return {
          ...skill,
          families: [],
        };
      });

      // step 3 - clone the skill family and attach the skill collection
      return {
        ...family,
        skills: skillWithChildrenRemoved,
      };
    },
  );
  return skillFamiliesWithSkills;
}

export type InvertedSkillExperience = Skill & {
  experiences: Omit<Experience, "user">[];
};
/**
 * Transforms an array of experiences with child skills into a tree of skills with child experiences.
 * @param { Experience[] } experiences - The collection of experiences with child skills to invert
 * @returns { Skill[] } - The new collection of skills with child experiences
 */
export function invertSkillExperienceTree(
  experiences: Omit<Experience, "user">[],
): InvertedSkillExperience[] {
  const allChildSkills = flatMap(experiences, (s) => s.skills).filter(notEmpty);
  const uniqueSkills = uniqBy(allChildSkills, "id");
  const skillsWithExperiences = uniqueSkills
    .filter(notEmpty)
    .map((skill: Skill) => {
      // step 1 - find the skills that belong to this experience
      const skillsInThisExperience = experiences.filter((experience) =>
        experience.skills?.some((childSkills) => skill.id === childSkills?.id),
      );

      // step 2 - clone the skill and attach the experience collection
      return {
        ...skill,
        experiences: skillsInThisExperience,
      };
    });
  return skillsWithExperiences;
}

export function filterSkillsByCategory(
  skills: Maybe<Skill[]> | undefined,
  category: SkillCategory,
) {
  return skills
    ?.filter((skill) => skill.category.value === category)
    .filter(notEmpty);
}

export function categorizeSkill(
  skills: Maybe<Skill[]> | undefined,
): Record<SkillCategory, Maybe<Skill[] | undefined>> {
  return {
    [SkillCategory.Technical]: filterSkillsByCategory(
      skills,
      SkillCategory.Technical,
    ),
    [SkillCategory.Behavioural]: filterSkillsByCategory(
      skills,
      SkillCategory.Behavioural,
    ),
  };
}

export const getMissingSkills = (required: Skill[], added?: Skill[]) => {
  return !added?.length
    ? required
    : required.filter((skill) => {
        return !added.find(
          (addedSkill) =>
            addedSkill.id === skill.id &&
            addedSkill.experienceSkillRecord?.details,
        );
      });
};

/**
 * Get Experience Skills
 *
 * Filters an array of experiences to get
 * only the ones associated with a specific skill
 *
 * @param experiences Experience[]  List of experiences to be filtered
 * @param skill Skill The skill to be used to filter experiences on
 * @returns Experience[]  New array of experiences
 */
export const getExperienceSkills = (
  experiences: Omit<Experience, "user">[],
  skill?: Pick<Skill, "id">,
): Omit<Experience, "user">[] => {
  return experiences.filter((experience) =>
    experience.skills?.some(
      (experienceSkill) => experienceSkill.id === skill?.id,
    ),
  );
};

/**
 * Get sorted skill levels
 *
 * Note: Codegen is sorting the enum alphabetically
 * We use this to sort them back into the proper order
 *
 * @returns SkillLevel[]
 */
export const getSortedSkillLevels = (): SkillLevel[] => {
  return [
    SkillLevel.Beginner,
    SkillLevel.Intermediate,
    SkillLevel.Advanced,
    SkillLevel.Lead,
  ];
};

/**
 * Parse a comma-separated list into an array of strings
 * @param {string | null | undefined} value A single string, representing a comma-separated list. Or, may be an empty list or undefined.
 * @returns {string[] | null}
 */
export const parseKeywords = (
  value: string | null | undefined,
): string[] | null => {
  return value?.trim()
    ? value
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word !== "")
    : null;
};

const categoryOrder = [SkillCategory.Technical, SkillCategory.Behavioural];

/**
 * Sort poolSkills collection by category of attached skill
 *
 * Technical first, behavioural second
 *
 * @param poolSkills PoolSkill[]
 * @returns PoolSkill[]
 */
export const sortPoolSkillsBySkillCategory = <T extends PoolSkill[]>(
  poolSkills: T,
) => {
  return poolSkills.sort((poolSkillA, poolSkillB) => {
    if (poolSkillA?.skill?.category && poolSkillB?.skill?.category) {
      return (
        categoryOrder.indexOf(
          poolSkillA.skill.category.value ?? SkillCategory.Behavioural,
        ) -
        categoryOrder.indexOf(
          poolSkillB.skill.category.value ?? SkillCategory.Behavioural,
        )
      );
    }
    return 0;
  });
};

/**
 * Filter poolSkills to get an array of essential or nonessential skills
 * Type PoolSkill not constrained as a maybe array of maybes won't get checked either way without a more thorough refactor
 *
 * @param poolSkills PoolSkill[]
 * @param poolSkillType PoolSkillType
 * @returns Skill[]
 */
export const filterPoolSkillsByType = (
  poolSkills: Maybe<Maybe<PoolSkill>[]> | undefined,
  poolSkillType: PoolSkillType,
): Skill[] => {
  const skills = unpackMaybes(poolSkills)
    .filter((poolSkill) => poolSkill.type?.value === poolSkillType)
    .map((poolSkill) => poolSkill.skill);
  return unpackMaybes(skills);
};

export function groupPoolSkillByType(
  poolSkills?: Maybe<Maybe<PoolSkill>[]>,
): Map<PoolSkillType, Skill[]> {
  return unpackMaybes(poolSkills).reduce((map, poolSkill) => {
    const { type, skill } = poolSkill;
    if (type?.value && skill) {
      if (!map.has(type.value)) {
        map.set(type.value, []);
      }
      map.get(type.value)?.push(skill);
    }
    return map;
  }, new Map<PoolSkillType, Skill[]>());
}

export function poolSkillsToSkills(poolSkills?: Maybe<Maybe<PoolSkill>[]>) {
  return unpackMaybes(poolSkills?.map((poolSkill) => poolSkill?.skill));
}
