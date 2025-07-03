import {
  PoolSkillType,
  SkillCategory,
  UpdateJobPosterTemplateEssentialTechnicalSkillsFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

export const filterEssentialTechnicalSkills = (
  allSkills: UpdateJobPosterTemplateEssentialTechnicalSkillsFragment["skills"],
) =>
  unpackMaybes(allSkills).filter(
    (s) =>
      s.pivot?.type.value === PoolSkillType.Essential &&
      s.skill.category.value === SkillCategory.Technical,
  );
