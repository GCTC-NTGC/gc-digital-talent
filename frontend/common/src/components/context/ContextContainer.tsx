import React from "react";

import ClientProvider from "../ClientProvider";
import { Messages } from "../LanguageRedirectContainer";
import AuthenticationProvider from "./AuthenticationProvider";
import AuthorizationProvider from "./AuthorizationProvider";
import LanguageRedirectProvider from "./LanguageRedirectProvider";

export interface ContextContainerProps {
  homePath: string;
  messages: Messages;
}

const ContextContainer: React.FC<ContextContainerProps> = ({
  homePath,
  messages,
  children,
}) => (
  <LanguageRedirectProvider messages={messages}>
    <AuthenticationProvider homePath={homePath}>
      <ClientProvider>
        <AuthorizationProvider>{children}</AuthorizationProvider>
      </ClientProvider>
    </AuthenticationProvider>
  </LanguageRedirectProvider>
);

export default ContextContainer;
