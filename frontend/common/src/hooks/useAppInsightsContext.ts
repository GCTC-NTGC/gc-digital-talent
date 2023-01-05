import { useContext } from "react";
import { AppInsightsContext } from "../components/context/AppInsightsContextProvider";

const useAppInsightsContext = () => {
  const context = useContext(AppInsightsContext);
  return context;
};

export default useAppInsightsContext;
