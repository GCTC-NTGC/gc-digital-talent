import React from "react";

import ClientProvider from "../ClientProvider";
import { AppInsightsContextProvider } from "./AppInsightsContextProvider";
import AuthenticationProvider from "./AuthenticationProvider";
import AuthorizationProvider from "./AuthorizationProvider";
import LanguageProvider, { Messages } from "./LanguageProvider";
import LocaleProvider from "./LocaleProvider";
// Note: Commented out until we have dark mode styles properly implemented
// import ThemeProvider from "../Theme";

export interface ContextContainerProps {
  messages: Messages;
  children: React.ReactNode;
}

const ContextContainer: React.FC<ContextContainerProps> = ({
  messages,
  children,
}) => (
  <LocaleProvider>
    <AuthenticationProvider>
      <LanguageProvider messages={messages}>
        {/* <ThemeProvider> */}
        <ClientProvider>
        <AppInsightsContextProvider>
            <AuthorizationProvider>{children}</AuthorizationProvider>
        </AppInsightsContextProvider>
        </ClientProvider>
        {/* </ThemeProvider> */}
      </LanguageProvider>
    </AuthenticationProvider>
  </LocaleProvider>
);

export default ContextContainer;
