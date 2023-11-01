import React from "react";

import { FeatureFlagContext } from "./FeatureFlagProvider";

const useFeatureFlags = () => {
  return React.useContext(FeatureFlagContext);
};

export default useFeatureFlags;
