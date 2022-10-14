import { getFeatureFlags } from "../helpers/runtimeVariable";

const useFeatureFlags = () => {
  return getFeatureFlags();
};

export default useFeatureFlags;
