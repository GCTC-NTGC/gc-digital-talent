import React from "react";

import { useTheme } from "@gc-digital-talent/theme";
import { Application_PoolCandidateFragment } from "@gc-digital-talent/graphql";

import {
  isIAPPool,
  getClassificationGroup,
  ClassificationGroup,
} from "~/utils/poolUtils";

interface ApplicationContextState {
  isIAP: boolean;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  classificationGroup?: ClassificationGroup;
}

const defaultContext: ApplicationContextState = {
  isIAP: false,
  followingPageUrl: undefined,
  currentStepOrdinal: undefined,
  classificationGroup: undefined,
};

const ApplicationContext =
  React.createContext<ApplicationContextState>(defaultContext);

export const useApplicationContext = () => {
  const ctx = React.useContext(ApplicationContext);

  return ctx;
};

interface ApplicationContextProviderProps {
  application: Application_PoolCandidateFragment;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  children: React.ReactNode;
}

const ApplicationContextProvider = ({
  application,
  followingPageUrl,
  currentStepOrdinal,
  children,
}: ApplicationContextProviderProps) => {
  const { setKey } = useTheme();
  const state = React.useMemo(
    () => ({
      isIAP: isIAPPool(application.pool),
      followingPageUrl,
      currentStepOrdinal,
      classificationGroup: getClassificationGroup(application.pool),
    }),
    [application.pool, followingPageUrl, currentStepOrdinal],
  );

  React.useEffect(() => {
    const themeCheck = setTimeout(() => {
      if (isIAPPool(application.pool)) {
        setKey("iap");
      }
    }, 10);

    return () => {
      clearTimeout(themeCheck);
    };
  }, [setKey, application]);

  return (
    <ApplicationContext.Provider value={state}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
