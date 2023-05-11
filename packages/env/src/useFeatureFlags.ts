import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  ongoingRecruitments: boolean;
  applicantDashboard: boolean;
  applicationRevamp: boolean;
  psacStrike: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
