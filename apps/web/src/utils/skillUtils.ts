import flatMap from "lodash/flatMap";
import uniqBy from "lodash/uniqBy";
import { IntlShape } from "react-intl";

import { getLocale } from "@gc-digital-talent/i18n";
import { matchStringCaseDiacriticInsensitive } from "@gc-digital-talent/forms";
import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";

import {
  Experience,
  Maybe,
  Skill,
  SkillCategory,
  SkillFamily,
} from "~/api/generated";

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

/**
 * Transforms an array of experiences with child skills into a tree of skills with child experiences.
 * @param { Experience[] } experiences - The collection of experiences with child skills to invert
 * @returns { Skill[] } - The new collection of skills with child experiences
 */
export function invertSkillExperienceTree(experiences: Experience[]): Skill[] {
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
  skills: Maybe<Array<Skill>>,
  category: SkillCategory,
) {
  return skills
    ?.filter((skill) => {
      return skill.families?.some((family) => family.category === category);
    })
    .filter(notEmpty);
}

export function categorizeSkill(
  skills: Maybe<Array<Skill>>,
): Record<SkillCategory, Maybe<Array<Skill>>> {
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

export function filterSkillsByNameOrKeywords(
  skills: Array<Skill>,
  searchQuery: string,
  intl: IntlShape,
) {
  const locale = getLocale(intl);

  const matchedSkills = skills
    .filter((skill) => {
      return (
        matchStringCaseDiacriticInsensitive(
          searchQuery,
          skill.name[locale] ?? "",
        ) ||
        skill.keywords?.[locale]?.some((keyword) => {
          return matchStringCaseDiacriticInsensitive(searchQuery, keyword);
        })
      );
    })
    .filter(notEmpty);
  return matchedSkills;
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
 * Differentiate Missing Skills
 *
 * Determines if a skill is missing or present but
 * simply missing details
 *
 * @param missingSkills Skill[] Array of skills that are missing from the application
 * @param addedSkills Skill[] Array of skills added to a users profile
 * @returns [skills: Skill[], details: Skill[]] Tuple where first index is the skills
 *          That are completely missing and second index are the skills that are present
 *          but missing details
 */
export const differentiateMissingSkills = (
  missingSkills: Skill[],
  addedSkills?: Skill[],
) => {
  const skills: Skill[] = [];
  const details: Skill[] = [];

  missingSkills.forEach((skill) => {
    const addedSkill = addedSkills?.find((added) => added.id === skill.id);

    if (addedSkill && !addedSkill.experienceSkillRecord?.details) {
      details.push(skill);
    } else {
      skills.push(skill);
    }
  });

  return [skills, details];
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
  experiences: Experience[],
  skill: Skill,
): Experience[] => {
  return experiences.filter((experience) =>
    experience.skills?.some(
      (experienceSkill) => experienceSkill.id === skill.id,
    ),
  );
};

/**
 * Get Experience's Skill Ids
 *
 * Given an array of experiences, return an array of skill ids found with duplicates removed
 *
 * @param experiences Experience[] Array of experiences
 * @returns String[] Array of unique skill ids
 */
export const getExperiencesSkillIds = (experiences: Experience[]): string[] => {
  let idCollection: string[] = [];
  experiences.forEach((experience) => {
    const { skills } = experience;
    if (skills && skills.length > 0) {
      const skillIdArray = skills.map((skill) => skill.id);
      idCollection = [...idCollection, ...skillIdArray];
    }
  });
  const deDupedIdCollection = uniqueItems(idCollection);

  return deDupedIdCollection;
};
