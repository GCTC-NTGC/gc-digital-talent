import React from "react";
import ReactDOM from "react-dom";
import IntlContainer from "./components/IntlContainer";
import { SearchDashboard } from "./components/SearchDashboard";

ReactDOM.render(
  <IntlContainer locale="en">
    <SearchDashboard />
  </IntlContainer>,
  document.getElementById("app"),
);
