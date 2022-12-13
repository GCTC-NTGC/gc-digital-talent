import { getFeatureFlags } from "../helpers/runtimeVariable";

export type FeatureFlags = {
  ongoingRecruitments: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
