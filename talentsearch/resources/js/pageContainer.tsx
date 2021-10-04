import React from "react";
import ReactDOM from "react-dom";
import IntlContainer from "./components/IntlContainer";
import { Router } from "./components/Router";

ReactDOM.render(
  <IntlContainer locale="en">
    <Router />
  </IntlContainer>,
  document.getElementById("app"),
);
