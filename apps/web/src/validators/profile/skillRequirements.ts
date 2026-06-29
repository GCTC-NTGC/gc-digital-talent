import { notEmpty } from "@gc-digital-talent/helpers";
import type { Pool } from "@gc-digital-talent/graphql";
import { SkillCategory, PoolSkillType } from "@gc-digital-talent/graphql";

import type { AddedSkill } from "~/utils/skillUtils";
import {
  filterPoolSkillsByType,
  filterSkillsByCategory,
  getMissingSkills,
} from "~/utils/skillUtils";

interface ApplicantExperience {
  skills?: AddedSkill[] | null;
}

export function isIncomplete(
  applicantExperiences: ApplicantExperience[] | null | undefined,
  pool: Omit<Pool, "activities" | "teamId" | "wasClosedEarly">,
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
