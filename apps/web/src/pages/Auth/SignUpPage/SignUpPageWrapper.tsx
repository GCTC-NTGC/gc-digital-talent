import { useFeatureFlags } from "@gc-digital-talent/env";

import SignUpPage from "./SignUpPage";
import SignUpPageDeprecated from "./SignUpPageDeprecated";

// simple switch based on feature flag
// remove this wrapper entirely when the flag is removed
const Component = () => {
  const featureFlags = useFeatureFlags();

  return featureFlags.disableClMigration ? (
    <SignUpPage />
  ) : (
    <SignUpPageDeprecated />
  );
};

export default Component;
