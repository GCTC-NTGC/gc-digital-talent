import React from "react";

import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import ClientProvider from "@common/components/ClientProvider";
import AuthenticationProvider from "./AuthenticationProvider";
import AuthorizationProvider from "./AuthorizationProvider";
import { getMessages } from "./IntlContainer";

const ContextContainer: React.FC = ({ children }) => (
  <LanguageRedirectContainer getMessages={getMessages}>
    <AuthenticationProvider>
      <ClientProvider>
        <AuthorizationProvider>{children}</AuthorizationProvider>
      </ClientProvider>
    </AuthenticationProvider>
  </LanguageRedirectContainer>
);

export default ContextContainer;
