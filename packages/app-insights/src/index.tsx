import { AppInsightsContext, AppInsightsProvider } from "./components/Provider";

import useAppInsightsContext from "./hooks/useAppInsightsContext";
import useAppInsightsCustomEvent from "./hooks/useAppInsightsCustomEvent";

import { reactPlugin, appInsights } from "./utils/reactPlugin";

export { AppInsightsContext, AppInsightsProvider };

export {
  useAppInsightsContext,
  useAppInsightsCustomEvent,
  reactPlugin,
  appInsights,
};
