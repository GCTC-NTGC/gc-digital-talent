import React from "react";
import ReactDOM from "react-dom";

import ContextContainer from "@common/components/context";
import { Messages } from "@common/components/LanguageRedirectContainer";
import { Toast } from "@common/components";
import { Router } from "./components/Router";
import * as talentSearchFrenchFile from "./lang/frCompiled.json";

ReactDOM.render(
  <>
    <ContextContainer messages={talentSearchFrenchFile as Messages}>
      <Router />
    </ContextContainer>
    <Toast />
  </>,
  document.getElementById("app"),
);
