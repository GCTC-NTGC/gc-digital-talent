import { AppInsightsContext, AppInsightsProvider } from "./components/Provider";
import useAppInsightsContext from "./hooks/useAppInsightsContext";
import useAppInsightsCustomEvent from "./hooks/useAppInsightsCustomEvent";
import {
  reactPlugin,
  appInsights,
  appInsightsIsEnabled,
} from "./utils/reactPlugin";
import trackEvent from "./utils/trackEvent";

export { AppInsightsContext, AppInsightsProvider };

export {
  useAppInsightsContext,
  useAppInsightsCustomEvent,
  reactPlugin,
  appInsights,
  appInsightsIsEnabled,
  trackEvent,
};
