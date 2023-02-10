import { ComponentType } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking,
} from "@microsoft/applicationinsights-react-js";

import { getRuntimeVariable } from "@gc-digital-talent/env";

const aiConnectionString = getRuntimeVariable(
  "APPLICATIONINSIGHTS_CONNECTION_STRING",
);

const reactPlugin = new ReactPlugin();

const ai = new ApplicationInsights({
  config: {
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    autoTrackPageVisitTime: true,
    disableFetchTracking: false,
    connectionString: aiConnectionString,
  },
});

if (aiConnectionString) {
  ai.loadAppInsights();
}

const { appInsights } = ai;
export { reactPlugin, appInsights };

export default (Component: ComponentType<unknown>) =>
  withAITracking(reactPlugin, Component);
