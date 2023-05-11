import {
  Applicant,
  PoolAdvertisement,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

import { screeningQuestionsSectionHasMissingResponses } from "~/validators/profile";

const stepHasError = (
  _applicant: Applicant,
  poolAdvertisement: PoolAdvertisement,
  application: Omit<PoolCandidate, "pool">,
) => {
  return screeningQuestionsSectionHasMissingResponses(
    application,
    poolAdvertisement,
  );
};

export default stepHasError;
