import uniqBy from "lodash/uniqBy";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import type {
  LocalizedString,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { SkillLevel, SkillCategory } from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import type { SimpleAnyExperience } from "./experienceUtils";

export interface SkillOption {
  id: string;
  key: string;
  name: LocalizedString;
  category: GenericLocalizedEnum<SkillCategory>;
}

export interface PoolSkillOption {
  id: string;
  type?: GenericLocalizedEnum<PoolSkillType> | null;
  requiredLevel?: SkillLevel | null;
  skill?: SkillOption | null;
}

export interface PoolWithSkills {
  poolSkills?: (PoolSkillOption | null)[] | null;
}

export interface SkillFamilyOption {
  id: string;
  name?: LocalizedString | null;
}

export interface SkillWithFamilies {
  id: string;
  families?: SkillFamilyOption[] | null;
}

/**
 * Transforms an array of skills with child skill families into a tree of skill families with child skills.
 * @param { SkillWithFamilies[] } skills - The collection of skills with child skill families to invert
 * @returns { SkillFamilyOption[] } - The new collection of skill families with child skills
 */
export function invertSkillSkillFamilyTree(skills: SkillWithFamilies[]) {
  const allChildSkillFamilies = skills
    .flatMap((s) => s.families)
    .filter(notEmpty);
  const uniqueSkillFamilies = uniqBy(allChildSkillFamilies, "id");
  const skillFamiliesWithSkills = uniqueSkillFamilies.map((family) => {
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
  });
  return skillFamiliesWithSkills;
}

interface InvertedExperience extends SimpleAnyExperience {
  id: string;
}

type InvertedSkillExperience = SkillOption & {
  experiences: InvertedExperience[];
};

interface ExperienceWithFullSkills extends InvertedExperience {
  skills?: SkillOption[] | null;
}

/**
 * Transforms an array of experiences with child skills into a tree of skills with child experiences.
 * @param experiences - The collection of experiences with child skills to invert
 * @returns - The new collection of skills with child experiences
 */
export function invertSkillExperienceTree(
  experiences: ExperienceWithFullSkills[],
): InvertedSkillExperience[] {
  const allChildSkills = experiences.flatMap((s) => s.skills).filter(notEmpty);
  const uniqueSkills = uniqBy(allChildSkills, "id");
  const skillsWithExperiences = uniqueSkills
    .filter(notEmpty)
    .map((skill: SkillOption) => {
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
  skills: SkillOption[] | null | undefined,
  category: SkillCategory,
) {
  return skills
    ?.filter((skill) => skill.category.value === category)
    .filter(notEmpty);
}

export function categorizeSkill(
  skills: SkillOption[] | null | undefined,
): Record<SkillCategory, SkillOption[] | undefined> {
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

export interface AddedSkill {
  id: string;
  experienceSkillRecord?: {
    details?: string | null | undefined;
  } | null;
}

export const getMissingSkills = (
  required: SkillOption[],
  added?: AddedSkill[],
) => {
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

export interface ExperienceWithSkills {
  skills?:
    | {
        id: string;
      }[]
    | null;
}

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
export const getExperienceSkills = <T extends ExperienceWithSkills>(
  experiences: T[],
  skill?: { id: string },
): T[] => {
  return experiences.filter((experience) =>
    experience.skills?.some(
      (experienceSkill) => experienceSkill.id === skill?.id,
    ),
  );
};

interface SkillExperienceGroup<
  E extends ExperienceWithSkills,
  S extends { id: string },
> {
  skill: S;
  experiences: E[];
}

export function groupExperiencesBySkill<
  E extends ExperienceWithSkills,
  S extends { id: string },
>(experiences: E[], skills: S[]): SkillExperienceGroup<E, S>[] {
  return skills.map((skill) => {
    const skillExperiences = getExperienceSkills(experiences, skill);

    return {
      skill,
      experiences: skillExperiences,
    };
  });
}

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
 * @param poolSkills The pool skills to sort
 * @returns The sorted pool skills
 */
export const sortPoolSkillsBySkillCategory = <T extends PoolSkillOption[]>(
  poolSkills: T,
) => {
  return [...poolSkills].sort((poolSkillA, poolSkillB) => {
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
 *
 * @param poolSkills The pool skills to filter
 * @param poolSkillType The pool skill type to keep
 * @returns The skills attached to the kept pool skills
 */
export const filterPoolSkillsByType = (
  poolSkills: (PoolSkillOption | null)[] | null | undefined,
  poolSkillType: PoolSkillType,
): SkillOption[] => {
  const skills = unpackMaybes(poolSkills)
    .filter((poolSkill) => poolSkill.type?.value === poolSkillType)
    .map((poolSkill) => poolSkill.skill);
  return unpackMaybes(skills);
};

export function groupPoolSkillByType(
  poolSkills?: (PoolSkillOption | null)[] | null,
): Map<PoolSkillType, SkillOption[]> {
  return unpackMaybes(poolSkills).reduce((map, poolSkill) => {
    const { type, skill } = poolSkill;
    if (type?.value && skill) {
      if (!map.has(type.value)) {
        map.set(type.value, []);
      }
      map.get(type.value)?.push(skill);
    }
    return map;
  }, new Map<PoolSkillType, SkillOption[]>());
}

export function poolSkillsToSkills(
  poolSkills?: (PoolSkillOption | null)[] | null,
) {
  return unpackMaybes(poolSkills?.map((poolSkill) => poolSkill?.skill));
}
