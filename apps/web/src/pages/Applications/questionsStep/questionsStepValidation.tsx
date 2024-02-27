import { User, Pool, PoolCandidate } from "@gc-digital-talent/graphql";

import {
  generalQuestionsSectionHasMissingResponses,
  screeningQuestionsSectionHasMissingResponses,
} from "~/validators/profile";

const stepHasError = (
  _user: User,
  pool: Pool,
  application: Omit<PoolCandidate, "pool">,
  RoDFlag: boolean,
) => {
  return (
    generalQuestionsSectionHasMissingResponses(application, pool) ||
    screeningQuestionsSectionHasMissingResponses(application, pool, RoDFlag)
  );
};

export default stepHasError;
