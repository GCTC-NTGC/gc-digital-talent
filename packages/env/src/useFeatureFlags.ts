import { useContext } from "react";

import { FeatureFlagContext } from "./FeatureFlagProvider";

const useFeatureFlags = () => {
  return useContext(FeatureFlagContext);
};

export default useFeatureFlags;
