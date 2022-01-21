import React from "react";
import ReactDOM from "react-dom";
import IntlContainer from "./components/IntlContainer";
import { PoolDashboard } from "./components/PoolDashboard";

ReactDOM.render(
  <IntlContainer locale="en">
    <PoolDashboard />
  </IntlContainer>,
  document.getElementById("app"),
);
