// find the index to insert into a sorted list
// https://www.30secondsofcode.org/js/s/insertion-index-in-sorted-array/
export function insertionIndex<T extends string | number | boolean>(
  arr: T[],
  n: T,
) {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.findIndex((el) => (isDescending ? n >= el : n <= el));
  return index === -1 ? arr.length : index;
}

interface HasASkillName {
  skillName: string | null;
}

// convenience function to index objects with a skill name
export function insertionIndexBySkillName(
  arr: HasASkillName[],
  n: HasASkillName,
) {
  const arrSortables = arr.map((x) => x.skillName ?? "");
  return insertionIndex(arrSortables, n.skillName ?? "");
}

import {
  PoolSkillType,
  SkillCategory,
  UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment,
  UpdateJobPosterTemplateEssentialTechnicalSkillsFragment,
  UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

export const isEssentialTechnicalSkill = (
  s: NonNullable<
    UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["jobPosterTemplateSkills"]
  >[number],
): boolean =>
  s.type.value === PoolSkillType.Essential &&
  s.skill?.category.value === SkillCategory.Technical;

export const filterEssentialTechnicalSkills = (
  allSkills: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["jobPosterTemplateSkills"],
) => unpackMaybes(allSkills).filter(isEssentialTechnicalSkill);

export const isNonessentialTechnicalSkill = (
  s: NonNullable<
    UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment["jobPosterTemplateSkills"]
  >[number],
): boolean =>
  s.type.value === PoolSkillType.Nonessential &&
  s.skill?.category.value === SkillCategory.Technical;

export const filterNonessentialTechnicalSkills = (
  allSkills: UpdateJobPosterTemplateNonessentialTechnicalSkillsFragment["jobPosterTemplateSkills"],
) => unpackMaybes(allSkills).filter(isNonessentialTechnicalSkill);

export const isEssentialBehaviouralSkill = (
  s: NonNullable<
    UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment["jobPosterTemplateSkills"]
  >[number],
): boolean =>
  s.type.value === PoolSkillType.Essential &&
  s.skill?.category.value === SkillCategory.Behavioural;

export const filterEssentialBehaviouralSkills = (
  allSkills: UpdateJobPosterTemplateEssentialBehaviouralSkillsFragment["jobPosterTemplateSkills"],
) => unpackMaybes(allSkills).filter(isEssentialBehaviouralSkill);
