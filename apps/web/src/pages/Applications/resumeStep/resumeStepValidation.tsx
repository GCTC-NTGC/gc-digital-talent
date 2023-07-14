import { User } from "@gc-digital-talent/graphql";

import { resumeIsIncomplete } from "~/validators/profile";

const stepHasError = (user: User) => {
  const isIncomplete = resumeIsIncomplete(user);
  return isIncomplete;
};

export default stepHasError;
