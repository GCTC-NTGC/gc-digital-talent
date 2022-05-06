import React from "react";
import ReactDOM from "react-dom";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import AuthContainer from "./components/AuthContainer";
import { PoolDashboard } from "./components/PoolDashboard";
import { getMessages } from "./components/IntlContainer";

ReactDOM.render(
  <LanguageRedirectContainer getMessages={getMessages}>
    <AuthContainer>
      <PoolDashboard />
    </AuthContainer>
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
