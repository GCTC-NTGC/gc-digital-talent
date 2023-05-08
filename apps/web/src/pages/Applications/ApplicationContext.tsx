import React from "react";

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

export default ApplicationContext;
