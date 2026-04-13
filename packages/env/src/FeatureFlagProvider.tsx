import type { ReactNode } from "react";
import { createContext, useMemo } from "react";

import type { FeatureFlags } from "./utils";
import { getFeatureFlags } from "./utils";

export const FeatureFlagContext = createContext(getFeatureFlags());

interface FeatureFlagProviderProps {
  children: ReactNode;
  flags?: FeatureFlags;
}

const FeatureFlagProvider = ({ children, flags }: FeatureFlagProviderProps) => {
  const featureFlags: FeatureFlags = useMemo(
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
