import { User, Pool } from "@gc-digital-talent/graphql";

import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (user: User, pool: Pool) => {
  return skillRequirementsIsIncomplete(user, pool);
};

export default stepHasError;
