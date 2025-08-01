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
