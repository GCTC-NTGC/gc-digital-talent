import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  applicantDashboard: boolean;
  psacStrike: boolean;
  skillLibrary: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
