import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";

import type { Application_PoolCandidateFragment } from "@gc-digital-talent/graphql";

interface ApplicationContextState {
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  classificationGroup?: string;
}

const defaultContext: ApplicationContextState = {
  followingPageUrl: undefined,
  currentStepOrdinal: undefined,
  classificationGroup: undefined,
};

const ApplicationContext =
  createContext<ApplicationContextState>(defaultContext);

export const useApplicationContext = () => {
  const ctx = useContext(ApplicationContext);

  return ctx;
};

interface ApplicationContextProviderProps {
  application: Application_PoolCandidateFragment;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  children: ReactNode;
}

const ApplicationContextProvider = ({
  application,
  followingPageUrl,
  currentStepOrdinal,
  children,
}: ApplicationContextProviderProps) => {
  const state = useMemo(
    () => ({
      followingPageUrl,
      currentStepOrdinal,
      classificationGroup: application.pool.classification?.group,
    }),
    [application.pool, followingPageUrl, currentStepOrdinal],
  );

  return (
    <ApplicationContext.Provider value={state}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
