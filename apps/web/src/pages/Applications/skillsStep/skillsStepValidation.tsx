import { Applicant, PoolAdvertisement } from "@gc-digital-talent/graphql";

import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (
  applicant: Applicant,
  poolAdvertisement: PoolAdvertisement,
) => {
  return skillRequirementsIsIncomplete(applicant, poolAdvertisement);
};

export default stepHasError;
