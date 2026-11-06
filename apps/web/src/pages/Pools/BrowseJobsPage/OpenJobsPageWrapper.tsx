import { useFeatureFlags } from "@gc-digital-talent/env";

import OpenJobsPage from "./OpenJobsPage";
import OpenJobsPageDeprecated from "./OpenJobsPageDeprecated";

/**
 * This component only exists to switch with a feature flag.
 * It can be removed when the feature flags is removed.
 **/
const Component = () => {
  const featureFlags = useFeatureFlags();
  return featureFlags.jobAlerts ? <OpenJobsPage /> : <OpenJobsPageDeprecated />;
};

Component.displayName = "OpenJobsPage";

export default Component;
