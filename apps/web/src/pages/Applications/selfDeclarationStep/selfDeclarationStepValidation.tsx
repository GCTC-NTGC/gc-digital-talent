import {
  Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType,
  Pool,
} from "@gc-digital-talent/graphql";

import { diversityEquityInclusionSectionHasEmptyRequiredFields } from "~/validators/profile";

const stepHasError = (
  user: ApplicationPoolCandidateFragmentType["user"],
  pool: Pool,
) => {
  const hasEmptyRequiredFields =
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
