/* eslint-disable import/prefer-default-export */
import flatMap from "lodash/flatMap";

import { notEmpty } from "@gc-digital-talent/helpers";
import { User, Pool, SkillCategory } from "@gc-digital-talent/graphql";

import { filterSkillsByCategory, getMissingSkills } from "~/utils/skillUtils";

export function isIncomplete(applicant: User, pool: Pool): boolean {
  const poolEssentialTechnicalSkills = filterSkillsByCategory(
    pool.essentialSkills,
    SkillCategory.Technical,
  );

  const applicantSkills = flatMap(applicant.experiences, (e) => {
    return e?.skills;
  }).filter(notEmpty);

  const missingSkills = getMissingSkills(
    poolEssentialTechnicalSkills ?? [],
    applicantSkills ?? [],
  );

  return missingSkills.length !== 0;
}
