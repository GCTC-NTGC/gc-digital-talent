import React from "react";
import ReactDOM from "react-dom";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import { PoolDashboard } from "./components/PoolDashboard";
import { getMessages } from "./components/IntlContainer";

ReactDOM.render(
  <LanguageRedirectContainer getMessages={getMessages}>
    <PoolDashboard />
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
