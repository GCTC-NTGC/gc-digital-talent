import { User, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

import { screeningQuestionsSectionHasMissingResponses } from "~/validators/profile";

const stepHasError = (
  _user: User,
  pool: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return screeningQuestionsSectionHasMissingResponses(application, pool);
};

export default stepHasError;
