import { User, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

import { generalQuestionsSectionHasMissingResponses } from "~/validators/profile";

const stepHasError = (
  _user: User,
  pool: Pool,
  application: Omit<PoolCandidate, "pool">,
) => {
  return generalQuestionsSectionHasMissingResponses(application, pool);
};

export default stepHasError;
