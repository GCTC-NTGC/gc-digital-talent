import React from "react";
import { createRoot } from "react-dom/client";

import "@gc-digital-talent/forms/dist/index.css";
import "@gc-digital-talent/ui/dist/index.css";
import "@gc-digital-talent/toast/dist/index.css";
import * as messages from "~/lang/frCompiled.json";
import ContextContainer from "~/components/Context/ContextProvider";
import Router from "~/components/Router";

const container = document.getElementById("app");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ContextContainer messages={messages}>
        <Router />
      </ContextContainer>
    </React.StrictMode>,
  );
}
