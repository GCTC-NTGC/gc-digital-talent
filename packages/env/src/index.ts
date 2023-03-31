import useFeatureFlags, { type FeatureFlags } from "./useFeatureFlags";
import {
  getRuntimeVariable,
  getRuntimeVariableNotNull,
  checkFeatureFlag,
  getFeatureFlags,
} from "./utils";

export type { FeatureFlags };

export {
  getRuntimeVariable,
  getRuntimeVariableNotNull,
  checkFeatureFlag,
  getFeatureFlags,
  useFeatureFlags,
};
