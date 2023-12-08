/* eslint-disable import/prefer-default-export */
import flatMap from "lodash/flatMap";

import { notEmpty } from "@gc-digital-talent/helpers";

import { User, Pool, SkillCategory } from "~/api/generated";
import { filterSkillsByCategory, getMissingSkills } from "~/utils/skillUtils";

type PartialUser = Pick<User, "experiences">;
type PartialPool = Pick<Pool, "essentialSkills" | "nonessentialSkills">;

export function isIncomplete(
  applicant: PartialUser,
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
