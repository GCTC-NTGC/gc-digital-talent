import { getFeatureFlags } from "../helpers/runtimeVariable";

export type FeatureFlags = {
  applicantSearch: boolean;
  ongoingRecruitments: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
