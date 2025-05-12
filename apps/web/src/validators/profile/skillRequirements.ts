import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Pool,
  SkillCategory,
  PoolSkillType,
  Experience,
} from "@gc-digital-talent/graphql";

import {
  filterPoolSkillsByType,
  filterSkillsByCategory,
  getMissingSkills,
} from "~/utils/skillUtils";

export function isIncomplete(
  applicantExperiences: Omit<Experience, "user">[] | undefined | null,
  pool: Pool,
): boolean {
  const poolEssentialTechnicalSkills = filterSkillsByCategory(
    filterPoolSkillsByType(pool.poolSkills, PoolSkillType.Essential),
    SkillCategory.Technical,
  );

  const applicantSkills =
    applicantExperiences
      ?.flatMap((e) => {
        return e?.skills;
      })
      .filter(notEmpty) ?? [];

  const missingSkills = getMissingSkills(
    poolEssentialTechnicalSkills ?? [],
    applicantSkills ?? [],
  );

  return missingSkills.length !== 0;
}
