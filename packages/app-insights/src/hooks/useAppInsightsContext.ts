import { useContext } from "react";

import { AppInsightsContext } from "../components/Provider";

const useAppInsightsContext = () => {
  const context = useContext(AppInsightsContext);
  return context;
};

export default useAppInsightsContext;
