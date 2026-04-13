import type { Decorator } from "@storybook/react-vite";
import { useParameter } from "storybook/preview-api";

import type { FeatureFlags } from "@gc-digital-talent/env";
import { FeatureFlagProvider } from "@gc-digital-talent/env";

const FeatureFlagDecorator: Decorator = (Story) => {
  const flags = useParameter<FeatureFlags | undefined>(
    "featureFlags",
    undefined,
  );
  return <FeatureFlagProvider {...{ flags }}>{Story()}</FeatureFlagProvider>;
};

export default FeatureFlagDecorator;
