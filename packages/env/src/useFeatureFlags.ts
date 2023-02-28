import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  ongoingRecruitments: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
