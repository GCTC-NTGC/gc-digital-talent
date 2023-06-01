import { Applicant, Pool } from "@gc-digital-talent/graphql";

import { diversityEquityInclusionSectionHasEmptyRequiredFields } from "~/validators/profile";

const stepHasError = (applicant: Applicant, pool: Pool) => {
  const hasEmptyRequiredFields =
    diversityEquityInclusionSectionHasEmptyRequiredFields(applicant, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
