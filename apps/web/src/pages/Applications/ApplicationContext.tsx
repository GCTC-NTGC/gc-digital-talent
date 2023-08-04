import React from "react";
import { useTheme } from "@gc-digital-talent/theme";

import { isIAPPool, getClassificationGroup } from "~/utils/poolUtils";
import { PoolCandidate } from "~/api/generated";

interface ApplicationContextState {
  isIAP: boolean;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  classificationGroup?: string;
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
  application: PoolCandidate;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
  classificationGroup?: string;
  children: React.ReactNode;
}

const ApplicationContextProvider = ({
  application,
  followingPageUrl,
  currentStepOrdinal,
  classificationGroup,
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
    [application, followingPageUrl, currentStepOrdinal],
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
