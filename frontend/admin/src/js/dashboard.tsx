import React from "react";
import ReactDOM from "react-dom";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import AuthContainer from "./components/AuthContainer";
import { PoolDashboard } from "./components/PoolDashboard";
import { getMessages } from "./components/IntlContainer";
import ClientProvider from "./components/ClientProvider";
import AuthorizationContainer from "./components/AuthorizationContainer";

ReactDOM.render(
  <LanguageRedirectContainer getMessages={getMessages}>
    <AuthContainer>
      <ClientProvider>
        <AuthorizationContainer>
          <PoolDashboard />
        </AuthorizationContainer>
      </ClientProvider>
    </AuthContainer>
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
