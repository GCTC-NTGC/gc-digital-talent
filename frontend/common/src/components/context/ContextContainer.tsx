import React from "react";

import ClientProvider from "../ClientProvider";
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
          <AuthorizationProvider>{children}</AuthorizationProvider>
        </ClientProvider>
        {/* </ThemeProvider> */}
      </LanguageProvider>
    </AuthenticationProvider>
  </LocaleProvider>
);

export default ContextContainer;
