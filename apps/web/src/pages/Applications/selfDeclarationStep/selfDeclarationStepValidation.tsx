import { Applicant, Pool } from "@gc-digital-talent/graphql";

import { diversityEquityInclusionSectionHasEmptyRequiredFields } from "~/validators/profile";

const stepHasError = (applicant: Applicant, poolAdvertisement: Pool) => {
  const hasEmptyRequiredFields =
    diversityEquityInclusionSectionHasEmptyRequiredFields(
      applicant,
      poolAdvertisement,
    );
  return hasEmptyRequiredFields;
};

export default stepHasError;
