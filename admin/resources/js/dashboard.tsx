import React from "react";
import ReactDOM from "react-dom";
import IntlContainer from "./components/IntlContainer";
import { PoolDashboard } from "./components/PoolDashboard";

const locale = document.documentElement.lang;

ReactDOM.render(
  <IntlContainer locale={locale}>
    <PoolDashboard />
  </IntlContainer>,
  document.getElementById("app"),
);
