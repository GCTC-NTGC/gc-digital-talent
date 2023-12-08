import { User, Pool } from "~/api/generated";
import { skillRequirementsIsIncomplete } from "~/validators/profile";

const stepHasError = (user: User, pool: Pool) => {
  return skillRequirementsIsIncomplete(user, pool);
};

export default stepHasError;
