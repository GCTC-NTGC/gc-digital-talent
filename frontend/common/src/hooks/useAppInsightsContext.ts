import { useContext } from "react";
import { AppInsightsContext } from "../components/AppInsights/AppInsightsContext";

const useAppInsightsContext = () => {
  const ctx = useContext(AppInsightsContext);
  return ctx;
};

export default useAppInsightsContext;
