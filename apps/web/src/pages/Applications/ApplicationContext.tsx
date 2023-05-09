import React from "react";
import { useTheme } from "@gc-digital-talent/theme";
import { PoolCandidate, PublishingGroup } from "../../api/generated";

interface ApplicationContextState {
  isIAP: boolean;
  followingPageUrl?: string;
}

const defaultContext: ApplicationContextState = {
  isIAP: false,
  followingPageUrl: undefined,
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
  children: React.ReactNode;
}

const ApplicationContextProvider = ({
  application,
  followingPageUrl,
  children,
}: ApplicationContextProviderProps) => {
  const { setKey } = useTheme();
  const state = React.useMemo(
    () => ({
      isIAP:
        application.poolAdvertisement?.publishingGroup === PublishingGroup.Iap,
      followingPageUrl,
    }),
    [application, followingPageUrl],
  );

  React.useEffect(() => {
    const themeCheck = setTimeout(() => {
      if (
        application.poolAdvertisement?.publishingGroup === PublishingGroup.Iap
      ) {
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
