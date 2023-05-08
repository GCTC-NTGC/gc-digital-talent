import React from "react";
import { useTheme } from "@gc-digital-talent/theme";
import { PoolCandidate, PublishingGroup } from "../../api/generated";

interface ApplicationContextState {
  isIAP: boolean;
}

const defaultContext: ApplicationContextState = {
  isIAP: false,
};

const ApplicationContext =
  React.createContext<ApplicationContextState>(defaultContext);

export const useApplicationContext = () => {
  const ctx = React.useContext(ApplicationContext);

  return ctx;
};

interface ApplicationContextProviderProps {
  application: Omit<PoolCandidate, "pool">;
  children: React.ReactNode;
}

const ApplicationContextProvider = ({
  application,
  children,
}: ApplicationContextProviderProps) => {
  const { setTheme, mode } = useTheme();
  const state = React.useMemo(
    () => ({
      isIAP:
        application.poolAdvertisement?.publishingGroup === PublishingGroup.Iap,
    }),
    [application],
  );

  if (application.poolAdvertisement?.publishingGroup) {
    setTheme("iap", mode);
  }

  return (
    <ApplicationContext.Provider value={state}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
