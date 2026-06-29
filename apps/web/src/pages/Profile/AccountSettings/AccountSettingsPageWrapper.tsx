import { useFeatureFlags } from "@gc-digital-talent/env";

import { AccountSettingsPage } from "./AccountSettingsPage";
import { AccountSettingsPageDeprecated } from "./AccountSettingsPageDeprecated";

/**
 * A wrapper to conditionally render the actual account page
 * depending on feature flags.  This component can be
 * entirely removed along with the deprecated page
 * when the flag is.
 */
export const Component = () => {
  const featureFlags = useFeatureFlags();

  return featureFlags.canadaLogin ? (
    <AccountSettingsPage />
  ) : (
    <AccountSettingsPageDeprecated />
  );
};

Component.displayName = "AccountSettingsPageWrapper";

export default Component;
