import * as React from "react";

import { getFeatureFlags, FeatureFlags } from "./utils";

export const FeatureFlagContext = React.createContext(getFeatureFlags());

interface FeatureFlagProviderProps {
  children: React.ReactNode;
  flags?: FeatureFlags;
}

const FeatureFlagProvider = ({ children, flags }: FeatureFlagProviderProps) => {
  const featureFlags: FeatureFlags = React.useMemo(
    () => ({
      ...getFeatureFlags(),
      ...(flags ?? {}),
    }),
    [flags],
  );

  return (
    <FeatureFlagContext.Provider value={featureFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export default FeatureFlagProvider;
