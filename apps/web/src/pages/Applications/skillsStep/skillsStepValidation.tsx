import { Applicant, Pool } from "@gc-digital-talent/graphql";

import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (applicant: Applicant, pool: Pool) => {
  return skillRequirementsIsIncomplete(applicant, pool);
};

export default stepHasError;
