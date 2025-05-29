import { useParameter } from "storybook/preview-api";
import { StoryFn } from "@storybook/react";

import { FeatureFlagProvider, FeatureFlags } from "@gc-digital-talent/env";

const FeatureFlagDecorator = (Story: StoryFn) => {
  const flags = useParameter<FeatureFlags | undefined>(
    "featureFlags",
    undefined,
  );
  return (
    <FeatureFlagProvider {...{ flags }}>
      <Story />
    </FeatureFlagProvider>
  );
};

export default FeatureFlagDecorator;
