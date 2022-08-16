import { checkFeatureFlag } from "../helpers/runtimeVariable";

const useFeatureFlags = () => {
  return {
    applicantProfile: checkFeatureFlag("FEATURE_APPLICANTPROFILE"),
    applicantSearch: checkFeatureFlag("FEATURE_APPLICANTSEARCH"),
    directIntake: checkFeatureFlag("FEATURE_DIRECTINTAKE"),
  };
};

export default useFeatureFlags;
