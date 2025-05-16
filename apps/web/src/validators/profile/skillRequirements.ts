import { notEmpty } from "@gc-digital-talent/helpers";
import { Pool, SkillCategory, PoolSkillType } from "@gc-digital-talent/graphql";

import {
  AddedSkill,
  filterPoolSkillsByType,
  filterSkillsByCategory,
  getMissingSkills,
} from "~/utils/skillUtils";

interface ApplicantExperience {
  skills?: AddedSkill[] | null;
}

export function isIncomplete(
  applicantExperiences: ApplicantExperience[] | null | undefined,
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
