import React from "react";
import ReactDOM from "react-dom";
import LanguageRedirectContainer from "@common/components/LanguageRedirectContainer";
import { Router } from "./components/Router";

import TalentSearchFrench from "./lang/frCompiled.json";

ReactDOM.render(
  <LanguageRedirectContainer messages={TalentSearchFrench}>
    <Router />
  </LanguageRedirectContainer>,
  document.getElementById("app"),
);
