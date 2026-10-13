import { useFeatureFlags } from "@gc-digital-talent/env";

import SignInPage from "./SignInPage";
import SignInPageDeprecated from "./SignInPageDeprecated";

// simple switch based on feature flag
// remove this wrapper entirely when the flag is removed
const Component = () => {
  const featureFlags = useFeatureFlags();

  return featureFlags.disableClMigration ? (
    <SignInPage />
  ) : (
    <SignInPageDeprecated />
  );
};

export default Component;
