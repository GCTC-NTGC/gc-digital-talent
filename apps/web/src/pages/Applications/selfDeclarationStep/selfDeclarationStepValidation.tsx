import { Applicant, PoolAdvertisement } from "@gc-digital-talent/graphql";

import { diversityEquityInclusionSectionHasEmptyRequiredFields } from "~/validators/profile";

const stepHasError = (
  applicant: Applicant,
  poolAdvertisement: PoolAdvertisement,
) => {
  const hasEmptyRequiredFields =
    diversityEquityInclusionSectionHasEmptyRequiredFields(
      applicant,
      poolAdvertisement,
    );
  return hasEmptyRequiredFields;
};

export default stepHasError;
