import React from "react";
import ReactDOM from "react-dom";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import { getMessages } from "./components/IntlContainer";
import { Router } from "./components/Router";

ReactDOM.render(
  <LanguageRedirectContainer getMessages={getMessages}>
    <Router />
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
