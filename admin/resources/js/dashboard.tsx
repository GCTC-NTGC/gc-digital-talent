import React from "react";
import ReactDOM from "react-dom";
import { LanguageRedirectContainer } from "./components/IntlContainer";
import { PoolDashboard } from "./components/PoolDashboard";

ReactDOM.render(
  <LanguageRedirectContainer>
    <PoolDashboard />
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
