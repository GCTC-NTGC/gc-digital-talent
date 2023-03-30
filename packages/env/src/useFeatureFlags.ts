import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  ongoingRecruitments: boolean;
  applicantDashboard: boolean;
  applicationRevamp: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
