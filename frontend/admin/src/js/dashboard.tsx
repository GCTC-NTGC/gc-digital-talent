import React from "react";
import ReactDOM from "react-dom";

import ContextContainer from "@common/components/context";
import { Messages } from "@common/components/LanguageRedirectContainer";
import { PoolDashboard } from "./components/PoolDashboard";
import adminRoutes from "./adminRoutes";
import * as adminFrench from "./lang/frCompiled.json";

ReactDOM.render(
  <ContextContainer
    homePath={adminRoutes("").home()}
    messages={adminFrench as Messages}
  >
    <PoolDashboard />
  </ContextContainer>,
  document.getElementById("app"),
);
