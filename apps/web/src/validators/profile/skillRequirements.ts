import { notEmpty } from "@gc-digital-talent/helpers";
import type { LocalizedString } from "@gc-digital-talent/graphql";
import { SkillCategory, PoolSkillType } from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

import type { AddedSkill } from "~/utils/skillUtils";
import {
  filterPoolSkillsByType,
  filterSkillsByCategory,
  getMissingSkills,
} from "~/utils/skillUtils";

interface ApplicantExperience {
  id: string;
  skills?: AddedSkill[] | null;
}

interface RequiredSkill {
  id: string;
  key: string;
  name: LocalizedString;
  category: GenericLocalizedEnum<SkillCategory>;
}

interface RequiredPoolSkill {
  id: string;
  type?: GenericLocalizedEnum<PoolSkillType> | null;
  skill?: RequiredSkill | null;
}

interface SkillRequirementPool {
  poolSkills?: (RequiredPoolSkill | null)[] | null;
}

export function isIncomplete(
  applicantExperiences: ApplicantExperience[] | null | undefined,
  pool: SkillRequirementPool,
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
