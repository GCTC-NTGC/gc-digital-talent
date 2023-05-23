import { Applicant, Pool } from "@gc-digital-talent/graphql";

import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (applicant: Applicant, poolAdvertisement: Pool) => {
  return skillRequirementsIsIncomplete(applicant, poolAdvertisement);
};

export default stepHasError;
