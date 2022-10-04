import React from "react";

import ClientProvider from "../ClientProvider";
import { Messages } from "../LanguageRedirectContainer";
import AuthenticationProvider from "./AuthenticationProvider";
import AuthorizationProvider from "./AuthorizationProvider";
import LanguageRedirectProvider from "./LanguageRedirectProvider";
import ThemeProvider from "../Theme";

export interface ContextContainerProps {
  messages: Messages;
}

const ContextContainer: React.FC<ContextContainerProps> = ({
  messages,
  children,
}) => (
  <LanguageRedirectProvider messages={messages}>
    <ThemeProvider>
      <AuthenticationProvider>
        <ClientProvider>
          <AuthorizationProvider>{children}</AuthorizationProvider>
        </ClientProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  </LanguageRedirectProvider>
);

export default ContextContainer;
