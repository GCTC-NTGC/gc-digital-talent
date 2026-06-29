import { Outlet } from "react-router";

import { useFeatureFlags } from "@gc-digital-talent/env";

import RegistrationRedirect from "./RegistrationRedirect";

/**
 * A wrapper to conditionally render the actual redirect
 * depending on feature flags.  This component can be
 * entirely removed along with the original redirect
 * when the flag is.
 */
export const Component = () => {
  const featureFlags = useFeatureFlags();

  return featureFlags.canadaLogin ? <Outlet /> : <RegistrationRedirect />;
};

Component.displayName = "RegistrationRedirectWrapper";

export default Component;
