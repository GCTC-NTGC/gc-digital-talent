import React from "react";
import ReactDOM from "react-dom";

import ContextContainer from "@common/components/context/ContextContainer";
import Toast from "@common/components/Toast/Toast";
import * as messages from "./lang/frCompiled.json";

import Router from "./components/Router";

ReactDOM.render(
  <>
    <ContextContainer messages={messages}>
      <Router />
    </ContextContainer>
    <Toast />
  </>,
  document.getElementById("app"),
);
