import type { ICustomProperties } from "@microsoft/applicationinsights-web";

import { appInsights, appInsightsIsEnabled } from "./reactPlugin";

/**
 * Track a custom event, adding the context properties our auth events share.
 *
 * Deliberately does not flush.  These events are followed by a full-page
 * navigation off-site, but the SDK already flushes on `beforeunload` /
 * `pagehide`.  Flushing by hand first drains the buffer into an extra send that
 * can exceed the unload size limit and fall back to a plain XHR the navigation
 * then cancels, losing the event entirely.  See #17454 and #17834.
 */
function trackEvent(name: string, properties?: ICustomProperties): void {
  if (!appInsightsIsEnabled) return;

  appInsights.trackEvent(
    { name },
    {
      aiUserId: appInsights.context?.user?.id || "unknown",
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || "none",
      ...properties,
    },
  );
}

export default trackEvent;
