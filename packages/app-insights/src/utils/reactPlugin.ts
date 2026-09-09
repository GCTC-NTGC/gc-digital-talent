import * as AppInsights from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

import { getRuntimeVariable } from "@gc-digital-talent/env";

const aiConnectionString = getRuntimeVariable(
  "APPLICATIONINSIGHTS_CONNECTION_STRING",
);

const reactPlugin = new ReactPlugin();

/**
 * The SDK's `BreezeChannelIdentifier`.  It is exported at runtime but missing
 * from the type declarations, so we can't import it.
 */
const SENDER_CHANNEL = "AppInsightsChannelPlugin";

/**
 * Weird syntax here but it is required for pnpm
 *
 * REF: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189
 */
const appInsights = new AppInsights.ApplicationInsights({
  config: {
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    autoTrackPageVisitTime: true,
    disableFetchTracking: false,
    connectionString: aiConnectionString,
    extensionConfig: {
      [SENDER_CHANNEL]: {
        // Keep every batch inside the 65000 byte limit of the only unload
        // transport that survives navigation (`fetch` with `keepalive`).  The
        // SDK default of 102400 is larger than that limit, so a full buffer can
        // never be delivered on unload.  See #17454.
        maxBatchSizeInBytes: 65000,
        // If we overshoot anyway, split the oversized beacon into per-event
        // beacons instead of falling back to a plain XHR that the navigation
        // cancels.  Partial delivery beats losing the whole batch.
        disableSendBeaconSplit: false,
      },
    },
  },
});

// `appInsights` is constructed either way, so it is always truthy.  Only this
// flag tells you whether it was actually loaded and can send anything.
const appInsightsIsEnabled = !!aiConnectionString;

if (appInsightsIsEnabled) {
  appInsights.loadAppInsights();
}

export { reactPlugin, appInsights, appInsightsIsEnabled };
