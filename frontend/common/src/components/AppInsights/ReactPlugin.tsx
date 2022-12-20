import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking,
} from "@microsoft/applicationinsights-react-js";
import { ComponentType } from "react";
import { getRuntimeVariable } from "../../helpers/runtimeVariable";

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
  },
});
if (aiConnectionString) {
  ai.config.connectionString = aiConnectionString;
  ai.loadAppInsights();
}
export default (Component: ComponentType<unknown>) =>
  withAITracking(reactPlugin, Component);
export const { appInsights } = ai;
export { reactPlugin };
