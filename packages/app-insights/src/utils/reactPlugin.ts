import * as AppInsights from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

import { getRuntimeVariable } from "@gc-digital-talent/env";

const aiConnectionString = getRuntimeVariable(
  "APPLICATIONINSIGHTS_CONNECTION_STRING",
);

const reactPlugin = new ReactPlugin();

/**
 * Weird syntax here but it is required for pnpm
 *
 * REF: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
 */
const appInsights = new AppInsights.ApplicationInsights({
  config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensions: [reactPlugin as any], // https://github.com/microsoft/applicationinsights-react-js/issues/32#issuecomment-1641631226
    enableAutoRouteTracking: true,
    autoTrackPageVisitTime: true,
    disableFetchTracking: false,
    connectionString: aiConnectionString,
  },
});

if (aiConnectionString) {
  appInsights.loadAppInsights();
}

export { reactPlugin, appInsights };
