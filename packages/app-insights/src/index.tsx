import { AppInsightsContext, AppInsightsProvider } from "./components/Provider";

import useAppInsightsContext from "./hooks/useAppInsightsContext";
import useAppInsightsCustomEvent from "./hooks/useAppInsightsCustomEvent";
import useLogger, { defaultLogger } from "./hooks/useLogger";

export { AppInsightsContext, AppInsightsProvider };

export {
  useAppInsightsContext,
  useAppInsightsCustomEvent,
  useLogger,
  defaultLogger,
};
