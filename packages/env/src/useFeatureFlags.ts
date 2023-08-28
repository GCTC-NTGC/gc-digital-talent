import { getFeatureFlags } from "./utils";

export type FeatureFlags = {
  skillLibrary: boolean;
};

const useFeatureFlags = (): FeatureFlags => {
  return getFeatureFlags();
};

export default useFeatureFlags;
