import React from "react";
import ReactDOM from "react-dom";
import ContextContainer from "@common/components/context/ContextContainer";

import Router from "./components/Router";

import * as messages from "./lang/frCompiled.json";

ReactDOM.render(
  <ContextContainer messages={messages}>
    <Router />
  </ContextContainer>,
  document.getElementById("app"),
);
