import React from "react";
import { createRoot } from "react-dom/client";

import ContextContainer from "@common/components/context/ContextContainer";
import Toast from "@common/components/Toast/Toast";

import Router from "./components/Router";

import * as messages from "./lang/frCompiled.json";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <>
      <ContextContainer messages={messages}>
        <Router />
      </ContextContainer>
      <Toast />
    </>,
  );
}
