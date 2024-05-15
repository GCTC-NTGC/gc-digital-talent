import { ReactElement, createContext } from "react";

import { reactPlugin } from "../utils/reactPlugin";

const AppInsightsContext = createContext(reactPlugin);

const AppInsightsProvider = ({ children }: { children: ReactElement }) => (
  <AppInsightsContext.Provider value={reactPlugin}>
    {children}
  </AppInsightsContext.Provider>
);

export { AppInsightsContext, AppInsightsProvider };
