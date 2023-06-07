/* eslint-disable import/prefer-default-export */
import flatMap from "lodash/flatMap";

import { Applicant, Pool, SkillCategory } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { filterSkillsByCategory, getMissingSkills } from "~/utils/skillUtils";

type PartialApplicant = Pick<Applicant, "experiences">;
type PartialPool = Pick<Pool, "essentialSkills" | "nonessentialSkills">;

export function isIncomplete(
  applicant: PartialApplicant,
  pool: PartialPool,
): boolean {
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
