import { User } from "@gc-digital-talent/graphql";

import { careerTimelineIsIncomplete } from "~/validators/profile";

const stepHasError = (user: User) => {
  const isIncomplete = careerTimelineIsIncomplete(user);
  return isIncomplete;
};

export default stepHasError;
