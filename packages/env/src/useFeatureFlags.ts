import { getFeatureFlags } from "./utils";

export type FeatureFlags = ReturnType<typeof getFeatureFlags>;
const useFeatureFlags = () => {
  return getFeatureFlags();
};

export default useFeatureFlags;
