import React from "react";
import ReactDOM from "react-dom";

import ContextContainer from "@common/components/context";
import { Messages } from "@common/components/LanguageRedirectContainer";
import { Toast } from "@common/components";
import { PoolDashboard } from "./components/PoolDashboard";
import * as adminFrench from "./lang/frCompiled.json";

ReactDOM.render(
  <>
    <ContextContainer messages={adminFrench as Messages}>
      <PoolDashboard />
    </ContextContainer>
    <Toast />
  </>,
  document.getElementById("app"),
);
