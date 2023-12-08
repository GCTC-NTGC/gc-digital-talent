import { User } from "~/api/generated";
import { careerTimelineIsIncomplete } from "~/validators/profile";

const stepHasError = (user: User) => {
  const isIncomplete = careerTimelineIsIncomplete(user);
  return isIncomplete;
};

export default stepHasError;
