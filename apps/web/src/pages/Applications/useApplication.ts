import { useOutletContext } from "react-router-dom";

import { Application_PoolCandidateFragment } from "@gc-digital-talent/graphql";

export interface ContextType { application: Application_PoolCandidateFragment }

const useApplication = () => {
  return useOutletContext<ContextType>();
};

export default useApplication;
