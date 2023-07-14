import { Applicant } from "@gc-digital-talent/graphql";

import { careerTimelineIsIncomplete } from "~/validators/profile";

const stepHasError = (applicant: Applicant) => {
  const isIncomplete = careerTimelineIsIncomplete(applicant);
  return isIncomplete;
};

export default stepHasError;
