import React from "react";
import ReactDOM from "react-dom";

import { PoolDashboard } from "./components/PoolDashboard";
import ContextContainer from "./components/context";

ReactDOM.render(
  <ContextContainer>
    <PoolDashboard />
  </ContextContainer>,
  document.getElementById("app"),
);
