import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  applicantDashboard: boolean;
  skillLibrary: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
