import { useContext } from "react";
import { AppInsightsContext } from "../components/AppInsights/AppInsightsContext";

const useAppInsightsContext = () => {
  const context = useContext(AppInsightsContext);
  return context;
};

export default useAppInsightsContext;
