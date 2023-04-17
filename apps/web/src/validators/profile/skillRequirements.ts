/* eslint-disable import/prefer-default-export */
import flatMap from "lodash/flatMap";

import {
  Applicant,
  PoolAdvertisement,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { filterSkillsByCategory, getMissingSkills } from "~/utils/skillUtils";

type PartialApplicant = Pick<Applicant, "experiences">;
type PartialPoolAdvertisement = Pick<
  PoolAdvertisement,
  "essentialSkills" | "nonessentialSkills"
>;

export function isIncomplete(
  applicant: PartialApplicant,
  poolAdvertisement: PartialPoolAdvertisement,
): boolean {
  const poolEssentialTechnicalSkills = filterSkillsByCategory(
    poolAdvertisement.essentialSkills,
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
