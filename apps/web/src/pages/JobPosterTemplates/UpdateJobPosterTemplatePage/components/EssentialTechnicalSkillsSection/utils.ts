import {
  PoolSkillType,
  SkillCategory,
  UpdateJobPosterTemplateEssentialTechnicalSkillsFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

export const isEssentialTechnicalSkill = (
  s: NonNullable<
    UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["skills"]
  >[number],
): boolean =>
  s.pivot?.type.value === PoolSkillType.Essential &&
  s.skill.category.value === SkillCategory.Technical;

export const filterEssentialTechnicalSkills = (
  allSkills: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["skills"],
) => unpackMaybes(allSkills).filter(isEssentialTechnicalSkill);
