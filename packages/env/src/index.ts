import FeatureFlagProvider from "./FeatureFlagProvider";
import useFeatureFlags from "./useFeatureFlags";
import {
  getRuntimeVariable,
  getRuntimeVariableNotNull,
  checkFeatureFlag,
  getFeatureFlags,
  type FeatureFlags,
} from "./utils";

export type { FeatureFlags };

export {
  FeatureFlagProvider,
  getRuntimeVariable,
  getRuntimeVariableNotNull,
  checkFeatureFlag,
  getFeatureFlags,
  useFeatureFlags,
};
