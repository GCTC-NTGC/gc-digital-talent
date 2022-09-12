// import { ApplicationInsights } from "@microsoft/applicationinsights-web";
// import {
//   ReactPlugin,
//   withAITracking,
// } from "@microsoft/applicationinsights-react-js";
// import { createBrowserHistory } from "history";
// import { APPLICATIONINSIGHTS_CONNECTION_STRING } from "../indigenousApprenticeshipConstants";

// const browserHistory = createBrowserHistory({});

// const reactPlugin = new ReactPlugin();
// const ai = new ApplicationInsights({
//   config: {
//     connectionString: APPLICATIONINSIGHTS_CONNECTION_STRING,
//     extensions: [reactPlugin],
//     extensionConfig: {
//       [reactPlugin.identifier]: { history: browserHistory },
//     },
//   },
// });
// export default (Component: any) => withAITracking(reactPlugin, Component);

// export const appInsights = ai.loadAppInsights();
