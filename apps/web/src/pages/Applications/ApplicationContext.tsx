import React from "react";
import { useTheme } from "@gc-digital-talent/theme";
import {
  Maybe,
  PoolAdvertisement,
  PoolCandidate,
  PublishingGroup,
} from "../../api/generated";

export function isIAPPoolAdvertisement(
  poolAdvertisement: Maybe<PoolAdvertisement>,
): boolean {
  return poolAdvertisement?.publishingGroup === PublishingGroup.Iap;
}
interface ApplicationContextState {
  isIAP: boolean;
  followingPageUrl?: string;
  currentStepOrdinal?: number;
}

const defaultContext: ApplicationContextState = {
  isIAP: false,
  followingPageUrl: undefined,
  currentStepOrdinal: undefined,
};

const ApplicationContext =
  React.createContext<ApplicationContextState>(defaultContext);

export const useApplicationContext = () => {
  const ctx = React.useContext(ApplicationContext);

  return ctx;
};

interface ApplicationContextProviderProps {
  application: Omit<PoolCandidate, "pool">;
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
      isIAP: isIAPPoolAdvertisement(application.poolAdvertisement),
      followingPageUrl,
      currentStepOrdinal,
    }),
    [application, followingPageUrl, currentStepOrdinal],
  );

  React.useEffect(() => {
    const themeCheck = setTimeout(() => {
      if (isIAPPoolAdvertisement(application.poolAdvertisement)) {
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
