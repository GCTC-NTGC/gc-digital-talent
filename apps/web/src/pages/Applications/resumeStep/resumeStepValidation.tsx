import { Applicant } from "@gc-digital-talent/graphql";

import { resumeIsIncomplete } from "~/validators/profile";

const stepHasError = (applicant: Applicant) => {
  const isIncomplete = resumeIsIncomplete(applicant);
  return isIncomplete;
};

export default stepHasError;
