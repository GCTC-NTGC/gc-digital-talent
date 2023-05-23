import { Applicant, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

import { screeningQuestionsSectionHasMissingResponses } from "~/validators/profile";

const stepHasError = (
  _applicant: Applicant,
  poolAdvertisement: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return screeningQuestionsSectionHasMissingResponses(
    application,
    poolAdvertisement,
  );
};

export default stepHasError;
