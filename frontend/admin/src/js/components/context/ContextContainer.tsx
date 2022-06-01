import React from "react";

import ClientProvider from "@common/components/ClientProvider";
import AuthenticationProvider from "./AuthenticationProvider";
import AuthorizationProvider from "./AuthorizationProvider";
import LanguageRedirectProvider from "./LanguageRedirectProvider";

const ContextContainer: React.FC = ({ children }) => (
  <LanguageRedirectProvider>
    <AuthenticationProvider>
      <ClientProvider>
        <AuthorizationProvider>{children}</AuthorizationProvider>
      </ClientProvider>
    </AuthenticationProvider>
  </LanguageRedirectProvider>
);

export default ContextContainer;
