import React from "react";
import ReactDOM from "react-dom";

import ContextContainer from "@common/components/context";
import { Messages } from "@common/components/LanguageRedirectContainer";
import { Toast } from "@common/components";
import { Router } from "./components/Router";
import talentSearchRoutes from "./talentSearchRoutes";
import * as talentSearchFrench from "./lang/frCompiled.json";

ReactDOM.render(
  <>
    <ContextContainer
      homePath={talentSearchRoutes("").home()}
      messages={talentSearchFrench as Messages}
    >
      <Router />
    </ContextContainer>
    <Toast />
  </>,
  document.getElementById("app"),
);
