import type { Decorator } from "@storybook/react";
import { useParameter } from "@storybook/preview-api";

import { FeatureFlagProvider, FeatureFlags } from "@gc-digital-talent/env";

const FeatureFlagDecorator: Decorator = (Story) => {
  const flags = useParameter<FeatureFlags | undefined>(
    "featureFlags",
    undefined,
  );
  return <FeatureFlagProvider {...{ flags }}>{Story()}</FeatureFlagProvider>;
};

export default FeatureFlagDecorator;
