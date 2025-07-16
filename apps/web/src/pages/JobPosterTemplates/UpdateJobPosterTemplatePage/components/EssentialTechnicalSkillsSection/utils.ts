import {
  PoolSkillType,
  SkillCategory,
  UpdateJobPosterTemplateEssentialTechnicalSkillsFragment,
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
