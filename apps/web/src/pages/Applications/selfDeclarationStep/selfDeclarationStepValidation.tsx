import { User, Pool } from "~/api/generated";
import { diversityEquityInclusionSectionHasEmptyRequiredFields } from "~/validators/profile";

const stepHasError = (user: User, pool: Pool) => {
  const hasEmptyRequiredFields =
    diversityEquityInclusionSectionHasEmptyRequiredFields(user, pool);
  return hasEmptyRequiredFields;
};

export default stepHasError;
