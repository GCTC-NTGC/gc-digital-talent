import React from "react";
import ReactDOM from "react-dom";
import IntlContainer from "./components/IntlContainer";
import Router from "./components/Router";

const locale = document.documentElement.lang;

ReactDOM.render(
  <IntlContainer locale={locale}>
    <Router />
  </IntlContainer>,
  document.getElementById("app"),
);
