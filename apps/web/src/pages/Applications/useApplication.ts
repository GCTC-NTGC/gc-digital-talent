import { useOutletContext } from "react-router-dom";

import { PoolCandidate } from "@gc-digital-talent/graphql";

export type ContextType = { application: PoolCandidate };

const useApplication = () => {
  return useOutletContext<ContextType>();
};

export default useApplication;
