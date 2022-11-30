import flatMap from "lodash/flatMap";
import uniqBy from "lodash/uniqBy";
import { IntlShape } from "react-intl";
import {
  Experience,
  Maybe,
  Skill,
  SkillCategory,
  SkillFamily,
} from "../api/generated";
import { matchStringCaseDiacriticInsensitive } from "./formUtils";
import { getLocale } from "./localize";
import { notEmpty } from "./util";

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
  const skillsWithExperiences = uniqueSkills.map((skill: Skill) => {
    // step 1 - find the skills that belong to this experience
    const skillsInThisExperience = experiences.filter((experience) =>
      experience.skills?.some((childSkills) => skill.id === childSkills?.id),
    );

    // step 2 - clone the experiences and strip off the child skills to prevent circular references
    const experienceWithChildrenRemoved = skillsInThisExperience.map(
      (experience) => {
        return {
          ...experience,
          skills: [],
        };
      },
    );

    // step 3 - clone the skill and attach the experience collection
    return {
      ...skill,
      experiences: experienceWithChildrenRemoved,
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

export default { invertSkillSkillFamilyTree, invertSkillExperienceTree };
