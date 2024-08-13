import { Application_PoolCandidateFragment as ApplicationPoolCandidateFragmentType } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { careerTimelineIsIncomplete } from "~/validators/profile";

const stepHasError = (user: ApplicationPoolCandidateFragmentType["user"]) => {
  const isIncomplete = careerTimelineIsIncomplete(
    user?.experiences?.filter(notEmpty),
  );
  return isIncomplete;
};

export default stepHasError;
