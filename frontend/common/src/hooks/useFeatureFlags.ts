import { checkFeatureFlag } from "../helpers/runtimeVariable";

const useFeatureFlags = () => {
  return {
    applicantSearch: checkFeatureFlag("FEATURE_APPLICANTSEARCH"),
    directIntake: checkFeatureFlag("FEATURE_DIRECTINTAKE"),
  };
};

export default useFeatureFlags;
