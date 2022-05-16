import React from "react";
import ReactDOM from "react-dom";

import { PoolDashboard } from "./components/PoolDashboard";
import ContextContainer from "./components/ContextContainer";

ReactDOM.render(
  <ContextContainer>
    <PoolDashboard />
  </ContextContainer>,
  document.getElementById("app"),
);
