import { getFeatureFlags } from "../helpers/runtimeVariable";

export type FeatureFlags = {
  directIntake: boolean;
  ongoingRecruitments: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
